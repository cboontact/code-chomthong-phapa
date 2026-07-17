import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const COOKIE_NAME = "pha_pha_admin_session";
const SESSION_HOURS = 12;

export type AdminIdentity = { username: string; displayName: string };

function env() { return getCloudflareContext().env; }

function credentials() {
  const bindings = env();
  return [
    { username: bindings.ADMIN_USERNAME || process.env.ADMIN_USERNAME, password: bindings.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD, displayName: bindings.ADMIN_DISPLAY_NAME || process.env.ADMIN_DISPLAY_NAME || "ผู้ดูแลระบบ" },
    { username: bindings.ADMIN2_USERNAME || process.env.ADMIN2_USERNAME, password: bindings.ADMIN2_PASSWORD || process.env.ADMIN2_PASSWORD, displayName: bindings.ADMIN2_DISPLAY_NAME || process.env.ADMIN2_DISPLAY_NAME || "ผู้ดูแลระบบ" },
  ];
}

export async function getAdminSession(): Promise<AdminIdentity | null> {
  const sessionId = (await cookies()).get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  const session = await env().DB.prepare("SELECT username, display_name AS displayName FROM admin_sessions WHERE id = ? AND datetime(expires_at) > datetime('now')").bind(sessionId).first<AdminIdentity>();
  return session ?? null;
}

export async function isAdmin() { return Boolean(await getAdminSession()); }

export async function createAdminSession(username: string, password: string) {
  const account = credentials().find((item) => item.username === username && item.password === password);
  if (!account) return false;
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString();
  await env().DB.prepare("DELETE FROM admin_sessions WHERE datetime(expires_at) <= datetime('now')").run();
  await env().DB.prepare("INSERT INTO admin_sessions (id, expires_at, username, display_name) VALUES (?, ?, ?, ?)").bind(id, expiresAt, account.username, account.displayName).run();
  (await cookies()).set(COOKIE_NAME, id, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_HOURS * 60 * 60 });
  return { username: account.username as string, displayName: account.displayName } satisfies AdminIdentity;
}

export async function deleteAdminSession() {
  const store = await cookies();
  const id = store.get(COOKIE_NAME)?.value;
  if (id) await env().DB.prepare("DELETE FROM admin_sessions WHERE id = ?").bind(id).run();
  store.delete(COOKIE_NAME);
}
