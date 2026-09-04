import * as Sentry from "@sentry/nextjs";

export function register() {}

export const onRequestError = Sentry.captureRequestError;
