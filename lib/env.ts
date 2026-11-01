import "server-only";
import { z } from "zod";

const schema = z.object({
  ENQUIRY_WEBHOOK_URL: z.url({ protocol: /^https$/ }).optional(),
});

export const env = schema.parse({
  ENQUIRY_WEBHOOK_URL: process.env.ENQUIRY_WEBHOOK_URL || undefined,
});

const adminSchema = z.object({
  ADMIN_USERNAME: z.string().min(3),
  ADMIN_PASSWORD_HASH: z.string().regex(/^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/),
  NEXTAUTH_SECRET: z.string().min(32),
});

// Parsed on first use, not at import: `next build` loads these modules without runtime secrets.
export const adminEnv = () => adminSchema.parse(process.env);
