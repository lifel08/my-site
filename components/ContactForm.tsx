"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // Turnstile may be undefined OR (in some runtimes) temporarily nullish
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

  // Hard guard against double-submits (React state is not synchronous)
  const inFlightRef = useRef(false);

  // Token state + ref (ref is source of truth at submit time)
  const [token, setToken] = useState("");
  const tokenRef = useRef("");
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // Status + debug logging wrapper
  const [status, _setStatus] = useState<Status>("idle");
  const setStatus = (next: Status) => {
    console.log(
      "[contact] setStatus ->",
      next,
      "| token:",
      tokenRef.current ? "present" : "missing"
    );
    _setStatus(next);
  };

  // Debug: show the underlying error (remove later)
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Load and render Turnstile widget
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

    const tryRender = () => {
      if (!containerRef.current) return;
      if (!window.turnstile || widgetIdRef.current) return;

      // render returns widgetId
      try {
        const wid = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (t: string) => {
            console.log("[contact] turnstile callback token set");
            setToken(t);
          },
          "expired-callback": () => {
            console.log("[contact] turnstile expired-callback (token cleared)");
            setToken("");
          },
          "error-callback": () => {
            console.log("[contact] turnstile error-callback (token cleared)");
            setToken("");
          },
        });

        widgetIdRef.current = wid;
      } catch (err) {
        console.log("[contact] turnstile render failed (ignored):", err);
      }
    };

    const i = window.setInterval(() => {
      tryRender();
      if (widgetIdRef.current) window.clearInterval(i);
    }, 100);

    return () => {
      window.clearInterval(i);

      // Best-effort remove (must never throw)
      try {
        const wid = widgetIdRef.current;
        if (wid) window.turnstile?.remove?.(wid);
      } catch {
        // ignore
      } finally {
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  function resetTurnstileAndToken() {
    console.log("[contact] resetTurnstileAndToken()");

    // Always clear token locally
    setToken("");
    tokenRef.current = "";

    // Best-effort turnstile reset (must never throw)
    try {
      const wid = widgetIdRef.current ?? undefined;
      // Optional chaining prevents "reading 'reset' of null"
      window.turnstile?.reset?.(wid);
    } catch (err) {
      console.log("[contact] turnstile reset failed (ignored):", err);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("[contact] onSubmit fired. inFlight:", inFlightRef.current);

    if (inFlightRef.current) return;

    const currentToken = tokenRef.current;
    console.log("[contact] token at submit:", currentToken ? "present" : "missing");

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

      console.log("[contact] response status:", res.status, "res.ok:", res.ok);
      console.log("[contact] response content-type:", res.headers.get("content-type"));

      // Treat any 2xx as SUCCESS for UI
      if (res.ok) {
        res
          .clone()
          .json()
          .then((d) => console.log("[contact] server json:", d))
          .catch((err) => console.log("[contact] json parse skipped:", err));

        setStatus("success");
        e.currentTarget.reset();
        resetTurnstileAndToken();
        return;
      }

      // Non-2xx: read response body for debugging
      const raw = await res.text().catch(() => "");
      console.log("[contact] non-2xx raw body:", raw);

      setErrorMsg(raw || "Request failed.");
      setStatus("error");
      resetTurnstileAndToken();
    } catch (err) {
      console.error("[contact] submit failed:", err);

      const msg =
        err instanceof Error
          ? `${err.name}: ${err.message}\n${err.stack ?? ""}`
          : String(err);

      setErrorMsg(msg || "Unknown error");
      setStatus("error");
      resetTurnstileAndToken();
    } finally {
      inFlightRef.current = false;
      console.log("[contact] finally: inFlight reset to false");
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

      {/* DEBUG UI (remove after fixing) */}
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
