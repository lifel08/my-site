import Script from "next/script";

type CMPMode = "USERCENTRICS" | "COOKIEBOT" | "NONE";

export default function CMP() {
  const mode = (process.env.NEXT_PUBLIC_CMP || "NONE") as CMPMode;

  if (mode === "USERCENTRICS") {
    const rulesetId = process.env.NEXT_PUBLIC_USERCENTRICS_RULESET_ID;

    if (!rulesetId) {
      console.warn("Usercentrics active but RULESET_ID missing");
      return null;
    }

    return (
      <>
        {/* Usercentrics Autoblocker */}
        <Script
          id="usercentrics-autoblocker"
          src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
          strategy="beforeInteractive"
        />

        {/* Usercentrics CMP UI */}
        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-ruleset-id={rulesetId}
          strategy="beforeInteractive"
        />
      </>
    );
  }

  if (mode === "COOKIEBOT") {
    const cbid = process.env.NEXT_PUBLIC_COOKIEBOT_CBID;



    if (!cbid) {
      console.warn("Cookiebot active but CBID missing");
      return null;
    }

    return (
      <Script
        id="cookiebot-cmp"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid={cbid}
        data-blockingmode="auto"
        strategy="beforeInteractive"
      />
    );
  }

  return null;
}
