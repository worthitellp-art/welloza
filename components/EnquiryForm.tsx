"use client";

import { useActionState } from "react";
import { sendEnquiry, type EnquiryState } from "@/lib/enquiry";

const initial: EnquiryState = { message: "", error: false, email: "" };

export function EnquiryForm() {
  const [state, action, pending] = useActionState(sendEnquiry, initial);

  return (
    <form className="subscribe" action={action} noValidate>
      <label className="sr-only" htmlFor="enquiry-email">
        Email address
      </label>
      <div className="subscribe-row">
        <input
          id="enquiry-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter email"
          defaultValue={state.email}
          maxLength={254}
          required
          aria-invalid={state.error || undefined}
          aria-describedby="enquiry-msg enquiry-help"
        />
        <button type="submit" disabled={pending} aria-label={pending ? "Sending" : "Send enquiry"}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
          </svg>
        </button>
      </div>
      <p className="subscribe-msg" id="enquiry-msg" role="status" aria-live="polite">
        {state.message}
      </p>
      <p id="enquiry-help">
        Connect with our team for tile details, project help, pricing and dealer enquiries. We will reply with the right
        options for your space.
      </p>
    </form>
  );
}
