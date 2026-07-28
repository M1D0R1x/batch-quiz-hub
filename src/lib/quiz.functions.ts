import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- Public / auth-required reads ----------

export const listCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: courses, error } = await context.supabase
      .from("courses")
      .select("id, name, description, icon")
      .order("name");
    if (error) throw new Error(error.message);

    const { data: subs, error: e2 } = await context.supabase
      .from("subtopics")
      .select("id, course_id, name, order_index")
      .order("order_index");
    if (e2) throw new Error(e2.message);

    return (courses ?? []).map((c) => ({
      ...c,
      subtopics: (subs ?? []).filter((s) => s.course_id === c.id),
    }));
  });

export const getCourseDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: course, error } = await context.supabase
      .from("courses")
      .select("id, name, description, icon")
      .eq("id", data.courseId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!course) throw new Error("Course not found");

    const { data: subs, error: e2 } = await context.supabase
      .from("subtopics")
      .select("id, name, order_index")
      .eq("course_id", data.courseId)
      .order("order_index");
    if (e2) throw new Error(e2.message);

    // per-subtopic attempt stats
    const { data: qs } = await context.supabase
      .from("questions")
      .select("id, subtopic_id")
      .in("subtopic_id", (subs ?? []).map((s) => s.id));

    const perSub = (subs ?? []).map((s) => ({
      ...s,
      question_count: (qs ?? []).filter((q) => q.subtopic_id === s.id).length,
    }));

    return { course, subtopics: perSub };
  });

// ---------- Profile / onboarding ----------

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_url, avatar_preset, show_on_leaderboard, course_track_id, onboarded_at")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z.object({ courseTrackId: z.string().uuid(), displayName: z.string().min(1).max(80).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({
        course_track_id: data.courseTrackId,
        display_name: data.displayName ?? undefined,
        onboarded_at: new Date().toISOString(),
      })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Quiz lifecycle ----------

const startSchema = z.object({
  courseId: z.string().uuid(),
  subtopicIds: z.array(z.string().uuid()).min(1),
  questionCount: z.number().int().min(1).max(200),
  timeLimitSeconds: z.number().int().min(0).nullable(),
  mix: z.enum(["mcq", "msq", "both"]),
  difficulty: z.enum(["any", "easy", "medium", "hard"]),
  isSimulate: z.boolean().default(false),
  negativePenalty: z.number().min(0).max(1).default(0), // 0 = disabled, 0.25 = standard, 0.33 = strict
});

export const startAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => startSchema.parse(d))
  .handler(async ({ data, context }) => {
    let q = context.supabase
      .from("questions")
      .select("id, subtopic_id, type, question_text, options, difficulty")
      .in("subtopic_id", data.subtopicIds);
    if (data.mix !== "both") q = q.eq("type", data.mix);
    if (data.difficulty !== "any") q = q.eq("difficulty", data.difficulty);

    const { data: pool, error } = await q;
    if (error) throw new Error(error.message);
    if (!pool || pool.length === 0) throw new Error("No questions match your filters. Try broadening them.");

    // shuffle + pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, data.questionCount);

    const { data: attempt, error: e2 } = await context.supabase
      .from("quiz_attempts")
      .insert({
        user_id: context.userId,
        course_id: data.courseId,
        subtopic_ids: data.subtopicIds,
        question_ids: shuffled.map((q) => q.id),
        question_count: shuffled.length,
        time_limit_seconds: data.timeLimitSeconds || null,
        is_simulate: data.isSimulate,
        negative_marking: data.negativePenalty,
        answers: {},
      })
      .select("id, started_at, time_limit_seconds, is_simulate, negative_marking")
      .single();
    if (e2) throw new Error(e2.message);

    // Never send correct answers during an active attempt.
    return {
      attempt,
      questions: shuffled.map((q) => ({
        id: q.id,
        subtopic_id: q.subtopic_id,
        type: q.type as "mcq" | "msq",
        question_text: q.question_text,
        options: q.options as string[],
        difficulty: q.difficulty as "easy" | "medium" | "hard",
      })),
    };
  });

export const getActiveAttempt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ attemptId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: attempt, error } = await context.supabase
      .from("quiz_attempts")
      .select("id, started_at, time_limit_seconds, is_simulate, question_ids, answers, completed_at, course_id")
      .eq("id", data.attemptId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!attempt) throw new Error("Attempt not found");

    const { data: qs, error: e2 } = await context.supabase
      .from("questions")
      .select("id, subtopic_id, type, question_text, options, difficulty")
      .in("id", attempt.question_ids);
    if (e2) throw new Error(e2.message);

    // preserve order
    const byId = new Map((qs ?? []).map((q) => [q.id, q]));
    const ordered = attempt.question_ids
      .map((id: string) => byId.get(id))
      .filter(Boolean)
      .map((q: any) => ({
        id: q.id,
        subtopic_id: q.subtopic_id,
        type: q.type as "mcq" | "msq",
        question_text: q.question_text,
        options: q.options as string[],
        difficulty: q.difficulty as "easy" | "medium" | "hard",
      }));

    return { attempt, questions: ordered };
  });

function scoreQuestion(type: "mcq" | "msq", correct: number[], picked: number[]): number {
  if (type === "mcq") {
    if (picked.length !== 1) return 0;
    return picked[0] === correct[0] ? 1 : 0;
  }
  // MSQ partial credit: (correct_selected - wrong_selected) / total_correct, floored at 0
  const correctSet = new Set(correct);
  const pickedCorrect = picked.filter((p) => correctSet.has(p)).length;
  const pickedWrong = picked.filter((p) => !correctSet.has(p)).length;
  const total = correct.length || 1;
  return Math.max(0, (pickedCorrect - pickedWrong) / total);
}

export const submitAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        attemptId: z.string().uuid(),
        answers: z.record(z.string(), z.array(z.number().int())),
        flagged: z.array(z.string().uuid()).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: attempt, error } = await context.supabase
      .from("quiz_attempts")
      .select("id, question_ids, completed_at, negative_marking")
      .eq("id", data.attemptId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.completed_at) return { ok: true, alreadyScored: true };

    const penalty = Number((attempt as any).negative_marking ?? 0);

    const { data: qs, error: e2 } = await context.supabase
      .from("questions")
      .select("id, type, correct_answers")
      .in("id", attempt.question_ids);
    if (e2) throw new Error(e2.message);

    let total = 0;
    let totalDeductions = 0;
    const max = attempt.question_ids.length;
    for (const q of qs ?? []) {
      const picked = data.answers[q.id] ?? [];
      const raw = scoreQuestion(q.type as any, q.correct_answers as number[], picked);
      let deduction = 0;
      // Apply negative marking to wrong answers (not unanswered)
      if (penalty > 0 && picked.length > 0 && raw < 1) {
        if (q.type === "mcq") {
          // MCQ wrong: full penalty
          deduction = penalty;
        } else {
          // MSQ: proportional to wrong selections
          const correctSet = new Set(q.correct_answers as number[]);
          const pickedWrong = picked.filter((p) => !correctSet.has(p)).length;
          deduction = pickedWrong > 0 ? penalty : 0;
        }
      }
      total += raw - deduction;
      totalDeductions += deduction;
    }
    total = Math.max(0, total); // floor at 0

    const { error: e3 } = await context.supabase
      .from("quiz_attempts")
      .update({
        completed_at: new Date().toISOString(),
        score: Number(total.toFixed(2)),
        max_score: max,
        answers: { picked: data.answers, flagged: data.flagged, totalDeductions: Number(totalDeductions.toFixed(2)) },
      })
      .eq("id", data.attemptId);
    if (e3) throw new Error(e3.message);

    return { ok: true, score: Number(total.toFixed(2)), max, totalDeductions: Number(totalDeductions.toFixed(2)) };
  });

export const getAttemptResult = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ attemptId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: attempt, error } = await context.supabase
      .from("quiz_attempts")
      .select(
        "id, course_id, subtopic_ids, question_ids, question_count, time_limit_seconds, is_simulate, started_at, completed_at, score, max_score, answers, negative_marking",
      )
      .eq("id", data.attemptId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!attempt) throw new Error("Attempt not found");

    const { data: qs, error: e2 } = await context.supabase
      .from("questions")
      .select("id, subtopic_id, type, question_text, options, correct_answers, explanation, difficulty")
      .in("id", attempt.question_ids);
    if (e2) throw new Error(e2.message);

    const { data: subs } = await context.supabase
      .from("subtopics")
      .select("id, name")
      .in("id", attempt.subtopic_ids);

    const { data: course } = await context.supabase
      .from("courses")
      .select("id, name")
      .eq("id", attempt.course_id)
      .maybeSingle();

    const picked = (attempt.answers as any)?.picked ?? {};
    const flagged: string[] = (attempt.answers as any)?.flagged ?? [];

    const byId = new Map((qs ?? []).map((q) => [q.id, q]));
    const orderedQs = attempt.question_ids.map((id: string) => byId.get(id)!).filter(Boolean);

    const subById = new Map((subs ?? []).map((s) => [s.id, s.name]));

    const negPenalty = Number((attempt as any).negative_marking ?? 0);

    const perSubtopic = new Map<string, { name: string; score: number; total: number }>();
    const details = orderedQs.map((q: any) => {
      const userPick: number[] = picked[q.id] ?? [];
      const raw = scoreQuestion(q.type, q.correct_answers as number[], userPick);
      let deduction = 0;
      if (negPenalty > 0 && userPick.length > 0 && raw < 1) {
        if (q.type === "mcq") {
          deduction = negPenalty;
        } else {
          const correctSet = new Set(q.correct_answers as number[]);
          const pickedWrong = userPick.filter((p: number) => !correctSet.has(p)).length;
          deduction = pickedWrong > 0 ? negPenalty : 0;
        }
      }
      const gained = Math.max(0, raw - deduction);
      const entry = perSubtopic.get(q.subtopic_id) ?? {
        name: subById.get(q.subtopic_id) ?? "Unknown",
        score: 0,
        total: 0,
      };
      entry.score += gained;
      entry.total += 1;
      perSubtopic.set(q.subtopic_id, entry);
      return {
        id: q.id,
        subtopic_id: q.subtopic_id,
        subtopic_name: subById.get(q.subtopic_id) ?? "",
        type: q.type as "mcq" | "msq",
        question_text: q.question_text,
        options: q.options as string[],
        correct_answers: q.correct_answers as number[],
        user_answers: userPick,
        explanation: q.explanation as string | null,
        difficulty: q.difficulty as "easy" | "medium" | "hard",
        gained,
        deduction,
        flagged: flagged.includes(q.id),
      };
    });

    const totalDeductions = (attempt.answers as any)?.totalDeductions ?? 0;

    return {
      attempt,
      course,
      details,
      negPenalty,
      totalDeductions,
      breakdown: Array.from(perSubtopic.entries()).map(([id, v]) => ({
        subtopic_id: id,
        name: v.name,
        score: Number(v.score.toFixed(2)),
        total: v.total,
        percent: v.total ? Math.round((v.score / v.total) * 100) : 0,
      })),
    };
  });

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: attempts, error } = await context.supabase
      .from("quiz_attempts")
      .select("id, course_id, subtopic_ids, score, max_score, completed_at, started_at")
      .eq("user_id", context.userId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);

    const list = attempts ?? [];
    const totalAttempts = list.length;
    const avgPercent =
      totalAttempts === 0
        ? 0
        : Math.round(
            (list.reduce((acc, a) => acc + (a.max_score ? Number(a.score) / Number(a.max_score) : 0), 0) /
              totalAttempts) *
              100,
          );

    // streak: consecutive calendar days with at least one completion
    const days = new Set(
      list.map((a) => new Date(a.completed_at as string).toISOString().slice(0, 10)),
    );
    let streak = 0;
    const d = new Date();
    while (days.has(d.toISOString().slice(0, 10))) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    }

    // strongest/weakest subtopic — sample from most recent 20 detailed
    const recentIds = list.slice(0, 20).map((a) => a.id);
    const subScores = new Map<string, { score: number; total: number }>();
    if (recentIds.length > 0) {
      const { data: detailed } = await context.supabase
        .from("quiz_attempts")
        .select("question_ids, answers")
        .in("id", recentIds);
      const allQids = new Set<string>();
      (detailed ?? []).forEach((a: any) => (a.question_ids ?? []).forEach((id: string) => allQids.add(id)));
      if (allQids.size > 0) {
        const { data: qs } = await context.supabase
          .from("questions")
          .select("id, subtopic_id, type, correct_answers")
          .in("id", Array.from(allQids));
        const qMap = new Map((qs ?? []).map((q) => [q.id, q]));
        (detailed ?? []).forEach((a: any) => {
          const picked = a.answers?.picked ?? {};
          (a.question_ids ?? []).forEach((qid: string) => {
            const q = qMap.get(qid);
            if (!q) return;
            const g = scoreQuestion(q.type as any, q.correct_answers as number[], picked[qid] ?? []);
            const cur = subScores.get(q.subtopic_id) ?? { score: 0, total: 0 };
            cur.score += g;
            cur.total += 1;
            subScores.set(q.subtopic_id, cur);
          });
        });
      }
    }
    const subIds = Array.from(subScores.keys());
    let subMeta: Array<{ id: string; name: string }> = [];
    if (subIds.length > 0) {
      const { data } = await context.supabase.from("subtopics").select("id, name").in("id", subIds);
      subMeta = data ?? [];
    }
    const enriched = subIds
      .map((id) => {
        const s = subScores.get(id)!;
        return {
          id,
          name: subMeta.find((m) => m.id === id)?.name ?? "Unknown",
          percent: s.total ? Math.round((s.score / s.total) * 100) : 0,
          total: s.total,
        };
      })
      .sort((a, b) => b.percent - a.percent);
    const strongest = enriched[0] ?? null;
    const weakest = enriched[enriched.length - 1] ?? null;

    return {
      totalAttempts,
      avgPercent,
      streak,
      strongest,
      weakest: strongest && weakest && strongest.id === weakest.id ? null : weakest,
      recent: list.slice(0, 5).map((a) => ({
        id: a.id,
        course_id: a.course_id,
        score: Number(a.score ?? 0),
        max_score: Number(a.max_score ?? 0),
        percent: a.max_score ? Math.round((Number(a.score) / Number(a.max_score)) * 100) : 0,
        completed_at: a.completed_at,
      })),
    };
  });