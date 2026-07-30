import { createServerFn } from "@tanstack/react-start";
import { setCookie, deleteCookie, getCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { SESSION_COOKIE_NAME, requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,30}$/;
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export const signUp = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        username: z
          .string()
          .regex(USERNAME_RE, "Username must be 3-30 characters: letters, numbers, '.', '_' or '-' only."),
        displayName: z.string().min(1, "Please enter your full name for the leaderboard.").optional(),
        password: z.string().min(6, "Password must be at least 6 characters."),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { hashPassword, createSessionToken } = await import("./session.server");

    const username = data.username.trim();
    const displayName = data.displayName?.trim() || username;

    // Check if username is taken
    const { data: existingUser } = await (supabaseAdmin.from("profiles" as any) as any)
      .select("id")
      .ilike("username", username)
      .maybeSingle();

    if (existingUser) {
      throw new Error("That username is taken. Try a different one, or sign in instead.");
    }

    const { data: profile, error } = await (supabaseAdmin.from("profiles" as any) as any)
      .insert({
        username,
        password_hash: hashPassword(data.password),
        display_name: displayName,
      })
      .select("id, username")
      .single();

    if (error) throw new Error(error.message);

    setCookie(SESSION_COOKIE_NAME, createSessionToken(profile.id, null), cookieOpts);
    return { ok: true, userId: profile.id as string };
  });

export const signIn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        username: z.string().min(1, "Enter your username."),
        password: z.string().min(1, "Enter your password."),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyPassword, createSessionToken } = await import("./session.server");

    const username = data.username.trim();

    // Find profile by username
    const { data: profile, error } = await (supabaseAdmin.from("profiles" as any) as any)
      .select("id, password_hash, username, onboarded_at")
      .ilike("username", username)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!profile?.password_hash || !verifyPassword(data.password, profile.password_hash)) {
      throw new Error("Incorrect username or password.");
    }

    setCookie(SESSION_COOKIE_NAME, createSessionToken(profile.id, null), cookieOpts);
    return { ok: true, userId: profile.id as string, onboarded: !!profile.onboarded_at };
  });

export const setUsername = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        username: z
          .string()
          .regex(USERNAME_RE, "Username must be 3-30 characters: letters, numbers, '.', '_' or '-' only."),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const username = data.username.trim();

    const { data: existing } = await (supabaseAdmin.from("profiles" as any) as any)
      .select("id")
      .ilike("username", username)
      .maybeSingle();

    if (existing && existing.id !== context.userId) {
      throw new Error("That username is taken. Try a different one.");
    }

    const { error } = await (supabaseAdmin.from("profiles" as any) as any)
      .update({
        username,
      })
      .eq("id", context.userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const signOutFn = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(SESSION_COOKIE_NAME);
  return { ok: true };
});

export const getSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(SESSION_COOKIE_NAME);
  if (!token) return null;
  const { verifySessionToken } = await import("./session.server");
  const session = verifySessionToken(token);
  return session ? { userId: session.uid } : null;
});
