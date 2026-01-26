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

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({
  messagePlaceholder = "Briefly describe your project or question",
  defaultSubject,
}: ContactFormProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const inFlightRef = useRef(false);

  const [token, setToken] = useState("");
  const tokenRef = useRef("");
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const [status, _setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // DEBUG: log every status change
  const setStatus = (next: Status) => {
    console.log(
      "[contact] setStatus ->",
      next,
      "| token:",
      tokenRef.current ? "present" : "missing"
    );
    _setStatus(next);
  };

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
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
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

  function resetTurnstileAndToken() {
    console.log("[contact] resetTurnstileAndToken()");

    // Always clear token locally (never throws)
    setToken("");
    tokenRef.current = "";

    // Best-effort turnstile reset (must never throw)
    try {
      const ts = window.turnstile;
      const wid = widgetIdRef.current;

      if (ts && typeof ts.reset === "function") {
        if (wid) ts.reset(wid);
        else ts.reset();
      }
    } catch (err) {
      console.log("[contact] turnstile reset failed (ignored):", err);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("[contact] onSubmit fired. inFlight:", inFlightRef.current);

    if (inFlightRef.current) {
      console.log("[contact] blocked: inFlightRef.current === true");
      return;
    }

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

      // IMPORTANT: treat any 2xx as SUCCESS for UI
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

      const raw = await res.text().catch(() => "");
      console.log("[contact] non-2xx raw body:", raw);

      setErrorMsg(raw || "Request failed.");
      setStatus("error");
      resetTurnstileAndToken();
    } catch (err) {
      console.error("[contact] submit failed:", err);
      setErrorMsg(err instanceof Error ? `${err.name}: ${err.message}` : "Unknown error");
      setStatus("error");
      resetTurnstileAndToken();
    } finally {
      inFlightRef.current = false;
      console.log("[contact] finally: inFlight reset to false");
    }
  }

  const clearErrorOnChange = () => {
    if (status === "error") {
      console.log("[contact] clearErrorOnChange -> idle");
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

      <div className="hidden" aria-hidden="true">
        <input name="company" tabIndex={-1} autoComplete="off" />
      </div>

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
