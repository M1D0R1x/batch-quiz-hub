import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        category: z.enum(["avg_score", "streak", "total_quizzes"]).default("avg_score"),
        period: z.enum(["all_time", "weekly"]).default("all_time"),
      })
      .default({})
      .parse(d ?? {})
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Get all public profiles
    const { data: profiles, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, avatar_preset")
      .neq("show_on_leaderboard", false);

    if (pErr) throw new Error(pErr.message);
    if (!profiles || profiles.length === 0) return { currentUserId: context.userId, entries: [] };

    const profileIds = profiles.map((p) => p.id);

    // Determine date filter for weekly
    let dateFilter: string | null = null;
    if (data.period === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = weekAgo.toISOString();
    }

    // Build attempts query using admin client so RLS doesn't hide other trainees' scores
    let attemptsQuery = supabaseAdmin
      .from("quiz_attempts")
      .select("id, user_id, score, max_score, completed_at, started_at, question_ids, answers")
      .in("user_id", profileIds)
      .not("completed_at", "is", null);

    if (dateFilter) {
      attemptsQuery = attemptsQuery.gte("completed_at", dateFilter);
    }

    const { data: attempts, error: aErr } = await attemptsQuery;
    if (aErr) throw new Error(aErr.message);

    const attemptList = attempts ?? [];

    // Group by user
    const userMap = new Map<string, {
      id: string;
      display_name: string;
      avatar_preset: string;
      scores: number[];
      totalQuizzes: number;
      daysActive: Set<string>;
      totalCorrect: number;
      totalAttempted: number;
    }>();

    for (const profile of profiles) {
      userMap.set(profile.id, {
        id: profile.id,
        display_name: profile.display_name || "Trainee",
        avatar_preset: profile.avatar_preset || "avatar_cloud_1",
        scores: [],
        totalQuizzes: 0,
        daysActive: new Set(),
        totalCorrect: 0,
        totalAttempted: 0,
      });
    }

    for (const attempt of attemptList) {
      const user = userMap.get(attempt.user_id);
      if (!user) continue;

      if (attempt.score != null && attempt.max_score != null && Number(attempt.max_score) > 0) {
        const pct = (Number(attempt.score) / Number(attempt.max_score)) * 100;
        user.scores.push(pct);
        // Accumulate accuracy: score = correct answers gained (out of max)
        user.totalCorrect += Number(attempt.score);
        user.totalAttempted += Number(attempt.max_score);
      }
      user.totalQuizzes += 1;
      if (attempt.completed_at) {
        const day = attempt.completed_at.split("T")[0];
        user.daysActive.add(day);
      }
    }

    // Build ranked list with composite rating score
    const ranked = Array.from(userMap.values())
      .filter((u) => u.totalQuizzes > 0)
      .map((u) => {
        const avgScore = u.scores.length > 0
          ? u.scores.reduce((a, b) => a + b, 0) / u.scores.length
          : 0;

        // Accuracy: correct / total questions answered (not just quizzes)
        const accuracyRate = u.totalAttempted > 0
          ? (u.totalCorrect / u.totalAttempted) * 100
          : 0;

        // Volume bonus: capped at 20 quizzes = full bonus
        const volumeBonus = (Math.min(u.totalQuizzes, 20) / 20) * 15;

        // Streak bonus: capped at 14 active days = full bonus
        const streakBonus = (Math.min(u.daysActive.size, 14) / 14) * 5;

        // Composite rating (0-100)
        const ratingScore = Math.round(
          avgScore * 0.55 + accuracyRate * 0.25 + volumeBonus + streakBonus
        );

        return {
          userId: u.id,
          displayName: u.display_name,
          avatarPreset: u.avatar_preset,
          avgScore: Math.round(avgScore),
          accuracyRate: Math.round(accuracyRate),
          totalQuizzes: u.totalQuizzes,
          daysActive: u.daysActive.size,
          quizzesCount: u.totalQuizzes,
          ratingScore,
        };
      });

    // Sort by ratingScore DESC, then totalQuizzes DESC as tie-breaker, then name ASC
    ranked.sort((a, b) => {
      if (b.ratingScore !== a.ratingScore) return b.ratingScore - a.ratingScore;
      if (b.totalQuizzes !== a.totalQuizzes) return b.totalQuizzes - a.totalQuizzes;
      return a.displayName.localeCompare(b.displayName);
    });

    return { currentUserId: context.userId, entries: ranked };
  });
