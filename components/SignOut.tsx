"use client";

import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <button type="button" className="btn light" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      Sign out
    </button>
  );
}
