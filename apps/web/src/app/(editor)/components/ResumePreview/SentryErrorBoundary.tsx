"use client";

import * as Sentry from "@sentry/nextjs";
import React from "react";

type SentryErrorBoundaryProps = {
  children: React.ReactNode;
  template?: string;
};

type SentryErrorBoundaryState = {
  hasError: boolean;
};

export default class SentryErrorBoundary extends React.Component<
  SentryErrorBoundaryProps,
  SentryErrorBoundaryState
> {
  state: SentryErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SentryErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag("area", "resume-preview");
      scope.setTag("template", this.props.template ?? "unknown");
      scope.setExtra("componentStack", errorInfo.componentStack);
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-sm">Preview failed to render.</div>;
    }

    return this.props.children;
  }
}
