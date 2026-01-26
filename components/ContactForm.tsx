"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string;
      // We intentionally do NOT rely on reset/remove at runtime.
      reset?: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    } | null;
  }
}

type ContactFormProps = {
  messagePlaceholder?: string;
  defaultSubject?: string;
};

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({
  messagePlaceholder = "Briefly describe your project or question",
  defaultSubject,
}: ContactFormProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Hard guard against double submits
  const inFlightRef = useRef(false);

  // Token state + ref
  const [token, setToken] = useState("");
  const tokenRef = useRef("");
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Status + error
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Load Turnstile script once
  useEffect(() => {
    if (!siteKey) return;

    const scriptId = "cf-turnstile";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }
  }, [siteKey]);

  // Render widget whenever we have a container AND no widgetId yet
  useEffect(() => {
    if (!siteKey) return;

    const tryRender = () => {
      const el = containerRef.current;
      const ts = window.turnstile;

      if (!el) return;
      if (!ts || widgetIdRef.current) return;

      try {
        widgetIdRef.current = ts.render(el, {
          sitekey: siteKey,
          callback: (t: string) => setToken(t),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      } catch {
        // ignore
      }
    };

    const i = window.setInterval(() => {
      tryRender();
      if (widgetIdRef.current) window.clearInterval(i);
    }, 100);

    return () => window.clearInterval(i);
  }, [siteKey]);

  /**
   * Hard reset without using turnstile.reset/remove.
   * This guarantees we never crash due to "reading 'reset' of null".
   */
  function hardResetWidget() {
    // Clear token
    setToken("");
    tokenRef.current = "";

    // Forget current widget id
    widgetIdRef.current = null;

    // Clear container so Turnstile can render fresh
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // After a short delay, the render effect/interval will render again
    // (no need to call reset/remove)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (inFlightRef.current) return;

    const currentToken = tokenRef.current;
    if (!currentToken) {
      setErrorMsg("Please complete the verification.");
      setStatus("error");
      return;
    }

    inFlightRef.current = true;
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(), // honeypot
      turnstileToken: currentToken,
      subject: defaultSubject ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      // UI rule: if server returned 2xx, treat as success
      if (res.ok) {
        setStatus("success");
        e.currentTarget.reset();
        hardResetWidget();
        return;
      }

      // Non-2xx: show message if available
      const raw = await res.text().catch(() => "");
      setErrorMsg(raw || "Request failed.");
      setStatus("error");
      hardResetWidget();
    } catch (err) {
      // Show the real client error for debugging
      const msg =
        err instanceof Error ? `${err.name}: ${err.message}` : "Unknown error";
      setErrorMsg(msg);
      setStatus("error");
      hardResetWidget();
    } finally {
      inFlightRef.current = false;
    }
  }

  const clearErrorOnChange = () => {
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="name"
        required
        placeholder="Your name"
        onChange={clearErrorOnChange}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />

      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        onChange={clearErrorOnChange}
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm"
      />

      <textarea
        name="message"
        rows={4}
        required
        placeholder={messagePlaceholder}
        onChange={clearErrorOnChange}
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
        className={`inline-flex rounded-xl bg-[#ff6400] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 ${
          status === "sending" ? "pointer-events-none" : ""
        }`}
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      {/* Remove these debug lines later */}
      <p className="text-xs text-neutral-500">
        debug: status={status} token={token ? "present" : "missing"}
      </p>
      {errorMsg && <p className="text-xs text-neutral-500">debug: errorMsg={errorMsg}</p>}

      {status === "success" && (
        <p className="text-sm text-green-700">Thanks — your message has been sent.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
