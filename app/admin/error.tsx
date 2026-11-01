"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main className="admin">
      <h1>Something went wrong</h1>
      <p className="admin-note">Your last change may not have been saved.</p>
      <button className="btn" type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
