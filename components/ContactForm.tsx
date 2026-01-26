"use client";

console.log("CONTACTFORM_VERSION = 2026-01-26-tokenref-sync-v2-formel");

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: any) => string;
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

  // Prevent double submit
  const inFlightRef = useRef(false);

  // Token state + ref (kept in sync synchronously)
  const [token, setToken] = useState("");
  const tokenRef = useRef("");

  // UI state
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  /* ------------------------------------------------------------------ */
  /* Load Turnstile script once                                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!siteKey) return;

    const scriptId = "cf-turnstile";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
    }
  }, [siteKey]);

  /* ------------------------------------------------------------------ */
  /* Render Turnstile widget                                             */
  /* ------------------------------------------------------------------ */
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
          callback: (t: string) => {
            tokenRef.current = t;
            setToken(t);
          },
          "expired-callback": () => {
            tokenRef.current = "";
            setToken("");
          },
          "error-callback": () => {
            tokenRef.current = "";
            setToken("");
          },
        });
      } catch {
        // ignore – retry via interval
      }
    };

    const i = window.setInterval(() => {
      tryRender();
      if (widgetIdRef.current) window.clearInterval(i);
    }, 100);

    return () => window.clearInterval(i);
  }, [siteKey]);

  /* ------------------------------------------------------------------ */
  /* Hard reset without calling turnstile.reset/remove                   */
  /* ------------------------------------------------------------------ */
  function hardResetWidget() {
    tokenRef.current = "";
    setToken("");
    widgetIdRef.current = null;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  }

  /* ------------------------------------------------------------------ */
  /* Submit handler (NULL-SAFE)                                          */
  /* ------------------------------------------------------------------ */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlightRef.current) return;

    // CRITICAL: capture form synchronously
    const formEl = e.currentTarget;

    const currentToken = tokenRef.current;
    if (!currentToken) {
      setErrorMsg("Please complete the verification.");
      setStatus("error");
      return;
    }

    inFlightRef.current = true;
    setStatus("sending");
    setErrorMsg("");

    const fd = new FormData(formEl);
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

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // ignore
      }

      if (res.ok && (json?.ok === true || json === null)) {
        setStatus("success");
        formEl.reset(); // SAFE
        hardResetWidget();
        return;
      }

      const msg =
        json?.error ??
        json?.message ??
        "Request failed.";
      setErrorMsg(String(msg));
      setStatus("error");
      hardResetWidget();
    } catch (err) {
      const msg =
        err instanceof Error ? `${err.name}: ${err.message}` : "Unknown error";
      setErrorMsg(msg);
      setStatus("error");
      hardResetWidget();
    } finally {
      inFlightRef.current = false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* UI helpers                                                         */
  /* ------------------------------------------------------------------ */
  const clearErrorOnChange = () => {
    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const sendDisabled = status === "sending" || !token;

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
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
        disabled={sendDisabled}
        className={`inline-flex rounded-xl bg-[#ff6400] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 ${
          status === "sending" ? "pointer-events-none" : ""
        }`}
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      {/* Debug (remove later) */}
      <p className="text-xs text-neutral-500">
        debug: status={status} token={token ? "present" : "missing"}
      </p>
      {errorMsg && (
        <p className="text-xs text-neutral-500">debug: errorMsg={errorMsg}</p>
      )}

      {status === "success" && (
        <p className="text-sm text-green-700">
          Thanks — your message has been sent.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
