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
    // Get all public profiles
    const { data: profiles, error: pErr } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_preset")
      .eq("show_on_leaderboard", true);

    if (pErr) throw new Error(pErr.message);

    if (!profiles || profiles.length === 0) return [];

    const profileIds = profiles.map((p) => p.id);

    // Determine date filter for weekly
    let dateFilter: string | null = null;
    if (data.period === "weekly") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = weekAgo.toISOString();
    }

    // Build attempts query
    let attemptsQuery = context.supabase
      .from("quiz_attempts")
      .select("id, user_id, score, max_score, completed_at, started_at")
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
    }>();

    for (const profile of profiles) {
      userMap.set(profile.id, {
        id: profile.id,
        display_name: profile.display_name || "Trainee",
        avatar_preset: profile.avatar_preset || "avatar_cloud_1",
        scores: [],
        totalQuizzes: 0,
        daysActive: new Set(),
      });
    }

    for (const attempt of attemptList) {
      const user = userMap.get(attempt.user_id);
      if (!user) continue;
      if (attempt.score != null && attempt.max_score != null && Number(attempt.max_score) > 0) {
        const pct = (Number(attempt.score) / Number(attempt.max_score)) * 100;
        user.scores.push(pct);
      }
      user.totalQuizzes += 1;
      if (attempt.completed_at) {
        const day = attempt.completed_at.split("T")[0];
        user.daysActive.add(day);
      }
    }

    // Build ranked list
    const ranked = Array.from(userMap.values()).map((u) => {
      const avgScore = u.scores.length > 0
        ? Math.round(u.scores.reduce((a, b) => a + b, 0) / u.scores.length)
        : 0;
      return {
        userId: u.id,
        displayName: u.display_name,
        avatarPreset: u.avatar_preset,
        avgScore,
        totalQuizzes: u.totalQuizzes,
        daysActive: u.daysActive.size,
        quizzesCount: u.totalQuizzes,
      };
    });

    // Sort
    ranked.sort((a, b) => {
      if (data.category === "avg_score") return b.avgScore - a.avgScore;
      if (data.category === "streak") return b.daysActive - a.daysActive;
      return b.totalQuizzes - a.totalQuizzes;
    });

    return ranked.filter((u) => u.totalQuizzes > 0);
  });
