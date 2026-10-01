# Privacy Policy: PostHog Integration

## PostHog

With your consent, we use PostHog, provided by PostHog Inc., 2261 Market Street #4008, San Francisco, CA 94114 (a U.S. company with subsidiaries in the UK and Germany), to understand how visitors use this website and improve its usability.

PostHog processes page views, website interactions, technical browser and device information, and pseudonymous browser identifiers. We record events such as successful contact-form submissions and loading additional publications. These custom events do not include the name, email address, or message entered in the contact form.

We also use PostHog for browser error tracking. **Session recordings help us investigate usability issues.** ⚠️ **[MANUAL CHECK REQUIRED]** The masking settings applied to these recordings need verification in your PostHog project settings—specifically:
- Whether **Mask all inputs** or **Mask sensitive inputs** is enabled
- Whether **Block on selectors** is configured for the contact form (`.contact-form input` or similar)
- Any other mask/filter rules applied to session recordings

For this consent-based processing, the legal basis is Art. 6(1)(a) GDPR and, where applicable, § 25(1) TDDDG. You can refuse or withdraw consent at any time through the cookie settings. Withdrawal does not affect the lawfulness of processing before withdrawal.

Data is hosted in **[EU or US region—see verification below]** and retained for **[see retention verification below]**. PostHog complies with the **EU-U.S. Data Privacy Framework** and uses Standard Contractual Clauses for transfers outside the EEA.

---

### ⚠️ Manual Verification Required: PostHog Project Settings

**Check these in your PostHog app dashboard ([https://us.posthog.com](https://us.posthog.com) or EU instance) → Project Settings → Security & Configuration:**

1. **Hosting Region:**  
   - Navigate to **Project Settings** → **General**
   - Confirm whether your PostHog instance is hosted in the **US** (api_host: `us.i.posthog.com`) or **EU** (api_host: `eu.i.posthog.com`)
   - Your code uses `NEXT_PUBLIC_POSTHOG_HOST` — check your `.env.local` or deployment environment variables
   - **Insert confirmed region in the draft:** `Data is hosted in [US / EU region name]`

2. **Retention Periods by Feature:**
   - **Project Settings** → **Data Management** or **Retention**
   - Note the retention period for:
     - **Events / Analytics events:** typically 5 years (configurable)
     - **Session Recordings:** (separate setting, often 30–90 days depending on plan)
     - **Error tracking events:** (if separate, usually same as events)
   - **Insert confirmed periods:** e.g., `Events retained for 5 years, Session Recordings for 90 days`

3. **Session Recording & Masking Settings:**
   - **Project Settings** → **Session Recording** or **Data & Recordings**
   - Confirm whether enabled: ✓ Yes / ✗ No
   - Check **Mask all inputs**, **Mask sensitive inputs**, or **Custom masking** rules
   - Note any **Block on selectors** configured for the contact form
   - **Insert description:** e.g., `Session recordings are enabled with Mask all inputs enabled. The contact form inputs (email, message) are masked to [describe rule].`

4. **Autocapture & Feature Toggles:**
   - **Project Settings** → **Autocapture** or **Ingestion**
   - Confirm whether **Autocapture** is enabled (tracks $pageview, $click, $submit, etc.)
   - Check **Heatmaps** status (enabled/disabled)
   - Check **Feature Flags** usage (enabled/disabled)
   - **Insert status:** e.g., `Autocapture is [enabled/disabled]; Heatmaps are [enabled/disabled].`

---

Separately, we send limited technical contact-form logs to PostHog to monitor reliability and troubleshoot failures. These contain fixed status messages indicating email-request acceptance, sending errors, or rate limiting, together with the endpoint and technical log metadata. The added log messages do not contain contact-form names, email addresses, or enquiry text. The legal basis is Art. 6(1)(f) GDPR, based on our legitimate interest in operating a reliable website. 

**[MANUAL CHECK REQUIRED]** These logs are sent via OpenTelemetry OTLP exporter to PostHog's logging endpoint and should follow the same retention as events. Confirm the log retention period in PostHog **Project Settings** → **Data Management** (should be same as Events retention). **Insert confirmed log retention period:** `[e.g., 5 years]`

---

## Consent Control: Cookiebot Integration

✅ **Verified:** PostHog client-side initialization is gated by Cookiebot `statistics` consent.

- **Mechanism:** When the page loads, the code checks `window.Cookiebot?.consent?.statistics`
- If **true** (user grants consent): PostHog `posthog.init()` runs immediately
- If **false** or Cookiebot is absent: initialization is deferred until the user grants consent via the `CookiebotOnConsentReady` event listener
- **Contact-form tracking:** `posthog.capture("contact_form_submitted", ...)` calls will only succeed if PostHog has been initialized (i.e., after consent)
- **Server-side logs:** Contact-form logs to PostHog's OTLP endpoint should be reviewed separately; consider whether these should also be suppressed for opted-out users if they contain identifying metadata

⚠️ **Legal Review Recommendation:** Confirm with your legal team that:
- Deferring client initialization until consent is sufficient for GDPR Art. 6(1)(a), or whether additional opt-in/opt-out controls are required
- Whether server-side OTLP logging of contact-form delivery status (without PII) can rely on Art. 6(1)(f) (legitimate interest) without explicit consent, or if it should also be gated by Cookiebot

---

## Cookiebot Consent Verification

✅ **Verified:** Cookiebot CMP is integrated and controls GTM injection.

- Cookiebot script injected in [app/layout.tsx](app/layout.tsx) with `data-cbid` (if `NEXT_PUBLIC_COOKIEBOT_CBID` is set)
- GTM is loaded only after Cookiebot `statistics` consent (component: [app/gtm-on-cookiebot-decision.tsx](app/gtm-on-cookiebot-decision.tsx))
- **Same pattern applied to PostHog:** Initialization deferred until Cookiebot `statistics` consent ([instrumentation-client.ts](instrumentation-client.ts))

✅ **Retained in policy:** "You can refuse or withdraw consent at any time through the cookie settings" — this is accurate; Cookiebot provides consent management UI.

---

## International Transfers & Safeguards

PostHog complies with the **EU-U.S. Data Privacy Framework** (certified) and uses **Standard Contractual Clauses (SCCs)** for data transfers outside the EEA. You can request a copy of PostHog's Data Processing Agreement (DPA) at [https://posthog.com/dpa](https://posthog.com/dpa) if required.

If your users are outside the U.S. (e.g., EU residents), confirm:
- Your PostHog instance region (EU or US—see verification section above)
- If **US-hosted**, ensure DPA/SCC terms are reviewed by your legal team

---

## Provider Information & Contact

**PostHog Inc.** (Data Controller)  
2261 Market Street #4008  
San Francisco, CA 94114  
United States

**Privacy Contact:** privacy@posthog.com  
**Full Privacy Policy:** https://posthog.com/privacy  
**Terms of Service:** https://posthog.com/terms

---

## Implementation Status

✅ **Verified as of [current date]:**
- Client-side PostHog initialization is gated behind Cookiebot `statistics` consent
- Contact-form event capture (`posthog.capture`) is protected by the same gate
- Server-side contact-form logs are exported via OpenTelemetry to PostHog OTLP endpoint (no PII in log messages)
- Cookiebot controls both GTM and PostHog through unified consent model

❌ **Not yet verified (manual checks required):**
- PostHog project hosting region (US vs. EU)
- Data retention periods for events, session recordings, and error tracking
- Session recording masking configuration
- Autocapture and heatmap settings status
- Log retention period (must match or be shorter than events)

---

## Next Steps

1. **Complete the bracketed [MANUAL CHECK REQUIRED] sections** above by logging into your PostHog dashboard and confirming the settings
2. **Review with legal counsel** (especially the TDDDG reference, international transfer mechanisms, and legitimate-interest basis for server logs)
3. **Test in browser** (incognito mode):
   - Confirm no PostHog network requests to `*.posthog.com` before granting Cookiebot statistics consent
   - Verify that `window.posthog` is `undefined` before consent and an object after granting consent
4. **Publish to your privacy policy page** (e.g., `/privacy-policy`) once verified and approved by legal

---

**Important:** This draft is based on verified code patterns and PostHog's public privacy documentation. Do not publish until you have:
- Confirmed all bracketed values from your PostHog project settings
- Obtained legal review of the GDPR/TDDDG bases and international transfer mechanisms
- Tested browser behavior to ensure no analytics collection before consent
