"use client";

import { refresh } from "@/api/auth";
import { setAccessToken } from "@/api/token";
import { createContext, useContext, useEffect, useState } from "react";

const AuthBootstrapContext = createContext(false);

export function useAuthBootstrap() {
  return useContext(AuthBootstrapContext);
}

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

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
      {children}
    </AuthBootstrapContext.Provider>
  );
}
