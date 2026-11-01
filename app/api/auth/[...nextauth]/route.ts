import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

type Context = { params: Promise<{ nextauth: string[] }> };

const handler = (req: NextRequest, context: Context) => NextAuth(req, context, authOptions());

export { handler as GET, handler as POST };
