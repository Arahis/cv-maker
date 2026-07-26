"use client";

import { refresh } from "@/api/auth";
import { setAccessToken } from "@/api/token";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const AuthBootstrapContext = createContext(false);
const AuthLogoutContext = createContext<{
  isLoggingOut: boolean;
  setIsLoggingOut: (value: boolean) => void;
}>({
  isLoggingOut: false,
  setIsLoggingOut: () => undefined,
});

export function useAuthBootstrap() {
  return useContext(AuthBootstrapContext);
}

export function useAuthLogout() {
  return useContext(AuthLogoutContext);
}

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggingOut(false);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    refresh()
      .catch(() => {
        setAccessToken(null);
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // The access token is kept in memory and is lost on a full page reload.
  // Auth-dependent queries use this value to wait for session restoration.
  return (
    <AuthBootstrapContext.Provider value={isReady}>
      <AuthLogoutContext.Provider value={{ isLoggingOut, setIsLoggingOut }}>
        {children}
      </AuthLogoutContext.Provider>
    </AuthBootstrapContext.Provider>
  );
}
