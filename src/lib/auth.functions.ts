import { createServerFn } from "@tanstack/react-start";
import { setCookie, deleteCookie, getCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { SESSION_COOKIE_NAME } from "@/integrations/supabase/auth-middleware";

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
          .regex(USERNAME_RE, "3-30 characters: letters, numbers, '.', '_' or '-' only."),
        password: z.string().min(6),
        contactEmail: z.string().email().optional().or(z.literal("")),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { hashPassword, createSessionToken } = await import("./session.server");

    const username = data.username.trim();

    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .maybeSingle();
    if (existing) {
      throw new Error("That username is taken. Try a different one, or sign in instead.");
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        username,
        password_hash: hashPassword(data.password),
        contact_email: data.contactEmail || null,
        display_name: username,
      })
      .select("id, contact_email")
      .single();
    if (error) throw new Error(error.message);

    setCookie(SESSION_COOKIE_NAME, createSessionToken(profile.id, profile.contact_email), cookieOpts);
    return { ok: true, userId: profile.id as string };
  });

export const signIn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ username: z.string().min(1), password: z.string().min(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyPassword, createSessionToken } = await import("./session.server");

    const username = data.username.trim();
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, password_hash, contact_email")
      .ilike("username", username)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!profile?.password_hash || !verifyPassword(data.password, profile.password_hash)) {
      throw new Error("Incorrect username or password.");
    }

    setCookie(SESSION_COOKIE_NAME, createSessionToken(profile.id, profile.contact_email), cookieOpts);
    return { ok: true, userId: profile.id as string };
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
