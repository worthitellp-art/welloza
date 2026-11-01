"use client";

import { useActionState } from "react";
import { sendEnquiry, type EnquiryState } from "@/lib/enquiry";

const initial: EnquiryState = { message: "", error: false, email: "" };

export function EnquiryForm() {
  const [state, action, pending] = useActionState(sendEnquiry, initial);

  return (
    <form className="form" action={action} noValidate>
      <label htmlFor="email">Email address</label>
      <div className="row">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          defaultValue={state.email}
          maxLength={254}
          required
          aria-invalid={state.error || undefined}
          aria-describedby="msg"
        />
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
      <div className="msg" id="msg" role="status" aria-live="polite">
        {state.message}
      </div>
    </form>
  );
}
