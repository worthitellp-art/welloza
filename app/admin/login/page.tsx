"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        username: form.get("username"),
        password: form.get("password"),
        redirect: false,
      });
      if (result?.ok) {
        router.push("/admin");
        return;
      }
      setError("Wrong ID or password, or too many attempts. Please wait 15 minutes if this continues.");
    } catch (err) {
      console.error("Sign in failed", err);
      setError("Could not sign in. Please try again.");
    }
    setPending(false);
  }

  return (
    <main className="admin admin-login">
      <h1>Admin sign in</h1>
      <form className="admin-form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="username">Admin ID</label>
          <input id="username" name="username" autoComplete="username" required maxLength={100} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={200} />
        </div>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </button>
        <p className="admin-error" role="status">
          {error}
        </p>
      </form>
    </main>
  );
}
