import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const SESSION_COOKIE_NAME = 'qf_session';

// Verifies our own signed session cookie (see src/lib/session.server.ts and
// src/lib/auth.functions.ts) — no Supabase Auth involved anywhere anymore.
// Keeps the same context shape (`supabase`, `userId`, `claims`) the rest of
// the app's server functions already expect, so nothing else needed to change.
export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const token = getCookie(SESSION_COOKIE_NAME);
    if (!token) {
      throw new Error('Unauthorized: not signed in');
    }

    const { verifySessionToken } = await import('@/lib/session.server');
    const session = verifySessionToken(token);
    if (!session) {
      throw new Error('Unauthorized: invalid or expired session');
    }

    // Loaded dynamically so the service-role key never ends up in the client bundle.
    const { supabaseAdmin } = await import('./client.server');

    return next({
      context: {
        supabase: supabaseAdmin,
        userId: session.uid,
        claims: { sub: session.uid, email: session.email },
      },
    });
  },
);
