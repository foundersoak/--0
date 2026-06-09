"use client";
import { type FormEvent, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, website }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        setError(j.error ?? "Couldn't send.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setMessage("");
    } catch {
      setError("Couldn't send.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return <p className="text-sm font-semibold text-emerald-300">Thanks, your message is on its way. ✓</p>;
  }

  const field =
    "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-amber-400/60 focus:outline-none";

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email (optional, so we can reply)"
        className={field}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={4}
        placeholder="Your message"
        className={field}
      />
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-xl bg-amber-400 px-6 py-2.5 font-bold text-black transition hover:bg-amber-300 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
