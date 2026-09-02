import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const environment =
  process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "production";

Sentry.init({
  dsn,
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  enabled: Boolean(dsn) && environment !== "development",
  sendDefaultPii: false,
  tracesSampleRate: 0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
