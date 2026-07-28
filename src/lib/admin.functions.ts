import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles" as any)
      .select("role")
      .eq("user_id", context.userId)
      .maybeSingle();

    const isRootAdmin = context.claims?.email === "veerababusaviti21@gmail.com";
    return {
      role: data?.role || (isRootAdmin ? "super_admin" : "user"),
      isAdmin: data?.role === "super_admin" || data?.role === "admin" || isRootAdmin,
      isSuperAdmin: data?.role === "super_admin" || isRootAdmin,
    };
  });

export const adminListCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: courses, error } = await context.supabase
      .from("courses")
      .select("id, name, description, icon, created_at")
      .order("name");
    if (error) throw new Error(error.message);

    const { data: subtopics, error: subErr } = await context.supabase
      .from("subtopics")
      .select("id, course_id, name, order_index")
      .order("order_index");
    if (subErr) throw new Error(subErr.message);

    const { data: questions, error: qErr } = await context.supabase
      .from("questions")
      .select("id, subtopic_id");
    if (qErr) throw new Error(qErr.message);

    return (courses ?? []).map((course) => {
      const courseSubtopics = (subtopics ?? []).filter((s) => s.course_id === course.id);
      const subtopicIds = new Set(courseSubtopics.map((s) => s.id));
      const questionCount = (questions ?? []).filter((q) => subtopicIds.has(q.subtopic_id)).length;

      return {
        ...course,
        subtopics: courseSubtopics,
        questionCount,
      };
    });
  });

export const adminCreateCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        name: z.string().min(2),
        description: z.string().optional(),
        icon: z.string().optional(),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const { data: course, error } = await context.supabase
      .from("courses")
      .insert({
        name: data.name,
        description: data.description ?? null,
        icon: data.icon ?? "cloud",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return course;
  });

export const adminCreateSubtopic = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        courseId: z.string().uuid(),
        name: z.string().min(2),
        orderIndex: z.number().int().default(0),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const { data: subtopic, error } = await context.supabase
      .from("subtopics")
      .insert({
        course_id: data.courseId,
        name: data.name,
        order_index: data.orderIndex,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return subtopic;
  });

export const adminListQuestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        subtopicId: z.string().uuid().optional(),
        search: z.string().optional(),
      })
      .default({})
      .parse(d ?? {})
  )
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("questions")
      .select("id, subtopic_id, type, question_text, options, correct_answers, explanation, difficulty, created_at")
      .order("created_at", { ascending: false });

    if (data.subtopicId) {
      query = query.eq("subtopic_id", data.subtopicId);
    }
    if (data.search) {
      query = query.ilike("question_text", `%${data.search}%`);
    }

    const { data: questions, error } = await query.limit(200);
    if (error) throw new Error(error.message);
    return questions ?? [];
  });

export const adminCreateQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        subtopicId: z.string().uuid(),
        type: z.enum(["mcq", "msq"]),
        questionText: z.string().min(5),
        options: z.array(z.string()).min(2),
        correctAnswers: z.array(z.number().int()),
        explanation: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const { data: question, error } = await context.supabase
      .from("questions")
      .insert({
        subtopic_id: data.subtopicId,
        type: data.type,
        question_text: data.questionText,
        options: data.options,
        correct_answers: data.correctAnswers,
        explanation: data.explanation ?? null,
        difficulty: data.difficulty,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return question;
  });

export const adminDeleteQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ questionId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("questions")
      .delete()
      .eq("id", data.questionId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profiles, error: pErr } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_preset, avatar_url, created_at");
    if (pErr) throw new Error(pErr.message);

    const { data: roles } = await context.supabase
      .from("user_roles" as any)
      .select("user_id, role");

    const roleMap = new Map((roles ?? []).map((r: any) => [r.user_id, r.role]));

    const currentIsRoot = context.claims?.email === "veerababusaviti21@gmail.com";

    return (profiles ?? []).map((p) => {
      let role = roleMap.get(p.id) || "user";
      if (p.id === context.userId && currentIsRoot) {
        role = "super_admin";
      }
      return {
        ...p,
        role,
      };
    });
  });

export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        targetUserId: z.string().uuid(),
        role: z.enum(["super_admin", "admin", "user"]),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const { data: roleRecord } = await context.supabase
      .from("user_roles" as any)
      .select("role")
      .eq("user_id", context.userId)
      .maybeSingle();

    const isSuperAdmin = (roleRecord as any)?.role === "super_admin" || context.claims?.email === "veerababusaviti21@gmail.com";
    if (!isSuperAdmin) {
      throw new Error("Forbidden: Only Super Admin can change user roles.");
    }

    const { error } = await context.supabase
      .from("user_roles" as any)
      .upsert({
        user_id: data.targetUserId,
        role: data.role,
      }, { onConflict: "user_id" });

    if (error) throw new Error(error.message);
    return { ok: true };
  });
