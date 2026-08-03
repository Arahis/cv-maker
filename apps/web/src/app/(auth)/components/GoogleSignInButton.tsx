"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        login_uri: string;
        ux_mode: "redirect";
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: {
          theme: "outline";
          size: "medium";
          text: "continue_with";
          shape: "rectangular";
          width: number;
        },
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const GoogleSignInButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (
      !isScriptReady ||
      !clientId ||
      !buttonRef.current ||
      !window.google ||
      isInitializedRef.current
    ) {
      return;
    }

    const buttonElement = buttonRef.current;

    window.google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: "redirect",
      login_uri: window.location.origin + "/api/auth/google",
    });
    window.google.accounts.id.renderButton(buttonElement, {
      theme: "outline",
      size: "medium",
      text: "continue_with",
      shape: "rectangular",
      width: 320,
    });
    isInitializedRef.current = true;
  }, [clientId, isScriptReady]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <Script
        id="google-identity-services"
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <div className="h-px flex-1 bg-gray-200" />
        <span>or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <div ref={buttonRef} className="flex min-h-10 justify-center" />
    </div>
  );
};

export default GoogleSignInButton;
