import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminEnv } from "@/lib/env";

const derive = promisify(scrypt) as (password: string, salt: Buffer, length: number) => Promise<Buffer>;

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const credentials = z.strictObject({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

async function verifyPassword(password: string, stored: string) {
  const [, salt, hash] = stored.split(":");
  const expected = Buffer.from(hash, "hex");
  return timingSafeEqual(await derive(password, Buffer.from(salt, "hex"), expected.length), expected);
}

function sameText(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

// Stored in D1 because Workers isolates do not share memory, so an in-memory counter would not hold.
async function countAttempt(ip: string) {
  const { env } = await getCloudflareContext({ async: true });
  const now = Date.now();
  const row = await env.DB.prepare(
    `INSERT INTO login_attempts (ip, count, reset_at) VALUES (?1, 1, ?2)
     ON CONFLICT (ip) DO UPDATE SET
       count = CASE WHEN reset_at < ?3 THEN 1 ELSE count + 1 END,
       reset_at = CASE WHEN reset_at < ?3 THEN ?2 ELSE reset_at END
     RETURNING count`,
  )
    .bind(ip, now + WINDOW_MS, now)
    .first<{ count: number }>();
  return row?.count ?? MAX_ATTEMPTS + 1;
}

async function clearAttempts(ip: string) {
  const { env } = await getCloudflareContext({ async: true });
  await env.DB.prepare("DELETE FROM login_attempts WHERE ip = ?1").bind(ip).run();
}

export const authOptions = (): NextAuthOptions => {
  const config = adminEnv();
  return {
    secret: config.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
    pages: { signIn: "/admin/login", error: "/admin/login" },
    providers: [
      CredentialsProvider({
        credentials: { username: {}, password: {} },
        async authorize(input, req) {
          const parsed = credentials.safeParse({ username: input?.username, password: input?.password });
          if (!parsed.success) return null;

          // cf-connecting-ip is set by Cloudflare and cannot be supplied by the client, unlike x-forwarded-for.
          const header = req.headers?.["cf-connecting-ip"];
          const ip = typeof header === "string" ? header : "unknown";
          if ((await countAttempt(ip)) > MAX_ATTEMPTS) return null;

          // The hash is always checked, so a wrong username takes as long as a wrong password.
          const passwordOk = await verifyPassword(parsed.data.password, config.ADMIN_PASSWORD_HASH);
          if (!passwordOk || !sameText(parsed.data.username, config.ADMIN_USERNAME)) return null;

          await clearAttempts(ip);
          return { id: "admin", name: config.ADMIN_USERNAME };
        },
      }),
    ],
  };
};

export async function requireAdmin() {
  const session = await getServerSession(authOptions());
  if (session?.user?.name !== adminEnv().ADMIN_USERNAME) redirect("/admin/login");
}
