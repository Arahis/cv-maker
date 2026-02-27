type GtagEventParams = Record<string, any>;

type EventType =
  | "create_resume_click"
  | "print_click"
  | "switch_var"
  | "printed"
  | "donate_click"
  | "preview_open_touch";

export function trackEvent(event: EventType, params?: GtagEventParams) {
  if (typeof window === "undefined") return;
  if (!("gtag" in window)) return;

  if (process.env.NODE_ENV !== "production") {
    console.debug("GA:", event, params);
    return;
  }

  // @ts-expect-error — gtag injected by GA
  window.gtag("event", event, params);
}
