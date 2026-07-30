// Server-only. Uses Node's built-in crypto — no external auth dependency needed.
//
// IMPORTANT: never import this at the top level of a *.functions.ts or route
// file (those ship to the client bundle). Use `await import(...)` inside a
// handler/middleware body instead — same pattern already used for client.server.ts.
import crypto from "node:crypto";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable. Set it in your .env file.");
  }
  return secret;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return check.length === expected.length && crypto.timingSafeEqual(check, expected);
}

type SessionPayload = { uid: string; email: string | null; iat: number };

export function createSessionToken(userId: string, contactEmail?: string | null): string {
  const payload: SessionPayload = { uid: userId, email: contactEmail ?? null, iat: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token: string): { uid: string; email: string | null } | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expected = crypto.createHmac("sha256", getSecret()).update(encoded).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionPayload;
    if (!data?.uid) return null;
    return { uid: data.uid, email: data.email ?? null };
  } catch {
    return null;
  }
}
