"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { env } from "@/lib/env";

export type EnquiryState = { message: string; error: boolean; email: string };

const schema = z.object({ email: z.email("Enter a valid email address, for example name@company.com.").max(254) });

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

// In-memory limiter: per server instance only. Swap for Upstash/KV if deployed serverless at scale.
function limited(ip: string) {
  const now = Date.now();
  if (hits.size > 1000) for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
  const hit = hits.get(ip);
  if (!hit || hit.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  hit.count += 1;
  return hit.count > MAX_PER_WINDOW;
}

export async function sendEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim() : "";
  const fail = (message: string): EnquiryState => ({ message, error: true, email });

  const parsed = schema.safeParse({ email });
  if (!parsed.success) return fail(parsed.error.issues[0].message);

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (limited(ip)) return fail("Too many requests. Please try again in a few minutes.");

  if (!env.ENQUIRY_WEBHOOK_URL) return fail("The enquiry form is not connected yet. Please try again later.");

  try {
    const res = await fetch(env.ENQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: parsed.data.email, source: "werroza-website" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Enquiry webhook responded ${res.status}`);
  } catch (err) {
    console.error("Enquiry delivery failed", err);
    return fail("Something went wrong. Please try again in a moment.");
  }

  return { message: "Thank you. We have your email and will reply soon.", error: false, email: "" };
}
