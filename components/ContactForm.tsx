"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type ContactFormProps = {
  messagePlaceholder?: string;
  defaultSubject?: string;
};

export default function ContactForm({
  messagePlaceholder = "Briefly describe your project or question",
  defaultSubject,
}: ContactFormProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (!siteKey) return;

    // Load Turnstile script once
    const scriptId = "cf-turnstile";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }

    const tryRender = () => {
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };

    const i = window.setInterval(() => {
      tryRender();
      if (widgetIdRef.current) window.clearInterval(i);
    }, 100);

    return () => {
      window.clearInterval(i);
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Require token (keeps UX consistent and avoids unnecessary 400s)
    if (!token) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(), // honeypot
      turnstileToken: token,
      subject: defaultSubject ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Prefer server JSON signal if available
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok || data?.ok !== true) {
        setStatus("error");
        return;
      }

      setStatus("success");
      e.currentTarget.reset();
      setToken("");

      // Turnstile reset should never break success state
      try {
        if (window.turnstile && widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
        }
      } catch {
        // ignore
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="name"
        required
        placeholder="Your name"
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />
      <textarea
        name="message"
        rows={4}
        required
        placeholder={messagePlaceholder}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Turnstile */}
      <div ref={containerRef} className="min-h-[65px]" />

      <button
        type="submit"
        disabled={status === "sending" || !token}
        className="inline-flex rounded-xl bg-[#ff6400] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-700">Thanks — your message has been sent.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
