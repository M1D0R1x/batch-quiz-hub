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
          .regex(USERNAME_RE, "3-30 characters: letters, numbers, '.', '_' or '-' only."),
        contactEmail: z.string().email("Please enter a valid email address."),
        password: z.string().min(6, "Password must be at least 6 characters."),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { hashPassword, createSessionToken } = await import("./session.server");

    const username = data.username.trim();
    const contactEmail = data.contactEmail.trim().toLowerCase();

    // Check if username is taken
    const { data: existingUser } = await (supabaseAdmin.from("profiles" as any) as any)
      .select("id")
      .ilike("username", username)
      .maybeSingle();

    if (existingUser) {
      throw new Error("That username is taken. Try a different one, or sign in instead.");
    }

    // Check if email is already registered
    const { data: existingEmail } = await (supabaseAdmin.from("profiles" as any) as any)
      .select("id")
      .ilike("contact_email", contactEmail)
      .maybeSingle();

    if (existingEmail) {
      throw new Error("An account with this email address already exists. Try signing in instead.");
    }

    const { data: profile, error } = await (supabaseAdmin.from("profiles" as any) as any)
      .insert({
        username,
        contact_email: contactEmail,
        password_hash: hashPassword(data.password),
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
    z
      .object({
        loginIdentifier: z.string().min(1, "Enter your username or email."),
        password: z.string().min(1, "Enter your password."),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { verifyPassword, createSessionToken } = await import("./session.server");

    const identifier = data.loginIdentifier.trim();

    // Try finding profile by username first
    let { data: profile, error } = await (supabaseAdmin.from("profiles" as any) as any)
      .select("id, password_hash, contact_email, username")
      .ilike("username", identifier)
      .maybeSingle();

    if (error) throw new Error(error.message);

    // If not found by username, try by contact_email
    if (!profile) {
      const { data: profileByEmail, error: emailError } = await (supabaseAdmin.from("profiles" as any) as any)
        .select("id, password_hash, contact_email, username")
        .ilike("contact_email", identifier)
        .maybeSingle();
      if (emailError) throw new Error(emailError.message);
      profile = profileByEmail;
    }

    if (!profile?.password_hash || !verifyPassword(data.password, profile.password_hash)) {
      throw new Error("Incorrect username/email or password.");
    }

    setCookie(SESSION_COOKIE_NAME, createSessionToken(profile.id, profile.contact_email), cookieOpts);
    return { ok: true, userId: profile.id as string };
  });

export const setUsername = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        username: z
          .string()
          .regex(USERNAME_RE, "3-30 characters: letters, numbers, '.', '_' or '-' only."),
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
        display_name: username,
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
