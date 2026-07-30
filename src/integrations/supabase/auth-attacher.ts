// Auth is now cookie-based — no bearer token attachment needed.
// This middleware is kept as a passthrough so start.ts doesn't need changes.
import { createMiddleware } from '@tanstack/react-start'

export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    return next();
  },
)
