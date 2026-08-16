import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getLearnProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_learn_progress" as any)
      .select("question_id, is_learned")
      .eq("user_id", context.userId);

    if (error) throw new Error(error.message);
    const learnedSet = new Set((data ?? []).filter((d: any) => d.is_learned).map((d: any) => d.question_id));
    return Array.from(learnedSet);
  });

export const toggleQuestionLearned = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        questionId: z.string().uuid(),
        isLearned: z.boolean(),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("user_learn_progress" as any)
      .upsert(
        {
          user_id: context.userId,
          question_id: data.questionId,
          is_learned: data.isLearned,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,question_id" }
      );

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getLearnSubtopicQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ subtopicId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: subtopic, error: subErr } = await context.supabase
      .from("subtopics")
      .select("id, name, course_id")
      .eq("id", data.subtopicId)
      .single();

    if (subErr) throw new Error(subErr.message);

    const { data: questions, error: qErr } = await context.supabase
      .from("questions")
      .select("id, subtopic_id, type, question_type, correct_option_count, total_options, question_text, options, correct_answers, explanation, difficulty")
      .eq("subtopic_id", data.subtopicId)
      .order("created_at");

    if (qErr) throw new Error(qErr.message);

    return {
      subtopic,
      questions: questions ?? [],
    };
  });

export const getLearnCourseQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ courseId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: course, error: cErr } = await context.supabase
      .from("courses")
      .select("id, name, description")
      .eq("id", data.courseId)
      .single();

    if (cErr) throw new Error(cErr.message);

    const { data: subtopics, error: sErr } = await context.supabase
      .from("subtopics")
      .select("id")
      .eq("course_id", data.courseId);

    if (sErr) throw new Error(sErr.message);

    const subtopicIds = (subtopics ?? []).map((s) => s.id);
    if (subtopicIds.length === 0) {
      return { course, questions: [] };
    }

    const { data: questions, error: qErr } = await context.supabase
      .from("questions")
      .select("id, subtopic_id, type, question_type, correct_option_count, total_options, question_text, options, correct_answers, explanation, difficulty")
      .in("subtopic_id", subtopicIds);

    if (qErr) throw new Error(qErr.message);

    return {
      course,
      questions: questions ?? [],
    };
  });
