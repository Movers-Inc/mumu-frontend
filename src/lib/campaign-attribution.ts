const ATTRIBUTION_KEY = "mumu_campaign_attribution";

export interface CampaignAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  capturedAt: string;
}

export function captureCampaignAttribution(search: string) {
  if (typeof sessionStorage === "undefined") return;
  const params = new URLSearchParams(search);
  const hasUtm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].some(
    (key) => params.has(key)
  );
  if (!hasUtm) return;

  const attribution: CampaignAttribution = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_content: params.get("utm_content") ?? undefined,
    utm_term: params.get("utm_term") ?? undefined,
    capturedAt: new Date().toISOString()
  };
  sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
}

export function getCampaignAttribution(): CampaignAttribution | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CampaignAttribution;
  } catch {
    return null;
  }
}

export function appendAttributionToUrl(baseUrl: string): string {
  const attribution = getCampaignAttribution();
  if (!attribution || typeof window === "undefined") return baseUrl;

  const url = new URL(baseUrl, window.location.origin);
  if (attribution.utm_source) url.searchParams.set("utm_source", attribution.utm_source);
  if (attribution.utm_medium) url.searchParams.set("utm_medium", attribution.utm_medium);
  if (attribution.utm_campaign) url.searchParams.set("utm_campaign", attribution.utm_campaign);
  return url.toString();
}
