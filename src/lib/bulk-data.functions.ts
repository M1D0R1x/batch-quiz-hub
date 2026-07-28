import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getBulkQuestionsData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: questions, error } = await context.supabase
      .from("questions")
      .select("id, subtopic_id, type, question_text, options, explanation, difficulty, created_at");

    if (error) throw new Error(error.message);

    const { data: subtopics, error: subErr } = await context.supabase
      .from("subtopics")
      .select("id, course_id, name, order_index");

    if (subErr) throw new Error(subErr.message);

    const { data: courses, error: courseErr } = await context.supabase
      .from("courses")
      .select("id, name, description, icon");

    if (courseErr) throw new Error(courseErr.message);

    // Compute simple version hash based on total questions count & max created_at
    const maxCreatedAt = (questions ?? []).reduce(
      (max, q) => (q.created_at > max ? q.created_at : max),
      ""
    );
    const version = `v1-${questions?.length || 0}-${maxCreatedAt}`;

    return {
      version,
      courses: courses ?? [],
      subtopics: subtopics ?? [],
      questions: questions ?? [],
    };
  });
