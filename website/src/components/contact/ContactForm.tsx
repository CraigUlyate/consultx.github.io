"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/contact-form.php", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setFeedback(
          payload?.message ||
            "We could not send your message right now. Please email info@consultx.co.za.",
        );
        return;
      }

      form.reset();
      setStatus("success");
      setFeedback(payload.message || "Thanks — your message has been sent.");
    } catch {
      setStatus("error");
      setFeedback(
        "We could not send your message right now. Please email info@consultx.co.za.",
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-4 rounded-3xl border border-consultx-border bg-white p-8 shadow-soft"
      noValidate
    >
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-consultx-charcoal">Name</span>
        <input
          type="text"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className="w-full rounded-md border border-consultx-border px-4 py-3 outline-none focus:border-consultx-green"
          placeholder="Your name"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-consultx-charcoal">Email</span>
        <input
          type="email"
          name="email"
          required
          maxLength={190}
          autoComplete="email"
          className="w-full rounded-md border border-consultx-border px-4 py-3 outline-none focus:border-consultx-green"
          placeholder="you@company.co.za"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-consultx-charcoal">Message</span>
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={5}
          className="w-full rounded-md border border-consultx-border px-4 py-3 outline-none focus:border-consultx-green"
          placeholder="What would you like to discuss?"
        />
      </label>

      {/* Honeypot — hidden from users */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {feedback ? (
        <p
          className={`text-sm leading-6 ${
            status === "success" ? "text-consultx-green-dark" : "text-red-600"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      ) : (
        <p className="text-xs leading-5 text-consultx-grey">
          We reply to enquiries at info@consultx.co.za.
        </p>
      )}
    </form>
  );
}
