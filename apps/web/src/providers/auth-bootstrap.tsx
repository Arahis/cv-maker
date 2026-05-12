"use client";

import { refresh } from "@/api/auth";
import { setAccessToken } from "@/api/token";
import { useEffect } from "react";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    refresh().catch(() => {
      setAccessToken(null);
    });
  }, []);

  return children;
}
