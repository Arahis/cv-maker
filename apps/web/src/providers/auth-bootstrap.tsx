"use client";

import { useQuery } from "@tanstack/react-query";
import { refresh } from "@/api/auth";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: refresh,
    retry: false,
    staleTime: Infinity,
  });

  return children;
}
