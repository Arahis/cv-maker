"use client";

import Script from "next/script";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/api/api-fetch";
import { setAccessToken } from "@/api/token";

type GoogleCodeClient = {
  requestCode: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (options: {
            client_id: string;
            scope: string;
            ux_mode?: "popup";
            callback: (response: { code?: string; error?: string }) => void;
            error_callback?: (response: { type?: string }) => void;
          }) => GoogleCodeClient;
        };
      };
    };
  }
}

const GoogleSignInButton = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  if (!clientId) return null;

  const handleGoogleLogin = () => {
    if (!window.google || isLoading) return;

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: clientId,
      scope: "openid email profile",
      ux_mode: "popup",
      error_callback: () => {
        setIsLoading(false);
      },
      callback: async ({ code, error }) => {
        if (error || !code) {
          setIsLoading(false);
          return;
        }

        try {
          const response = await apiFetch<{ accessToken: string }>(
            "/auth/google",
            {
              method: "POST",
              body: JSON.stringify({ code }),
            },
          );
          setAccessToken(response.accessToken);
          await queryClient.invalidateQueries({ queryKey: ["me"] });
          router.replace("/resumes");
        } catch {
          setIsLoading(false);
        }
      },
    });

    setIsLoading(true);
    client.requestCode();
  };

  return (
    <>
      {isLoading && (
        <div className="bg-background fixed inset-0 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-slate-600">
              Signing in with Google...
            </p>
          </div>
        </div>
      )}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <span className="text-base font-bold text-blue-600">G</span>
        {isLoading ? "Signing in..." : "Continue with Google"}
      </Button>
    </>
  );
};

export default GoogleSignInButton;
