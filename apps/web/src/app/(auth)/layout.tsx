"use client";

import Loading from "@/components/Loading";
import { useAuthBootstrap } from "@/providers/auth-bootstrap";
import { useMeQuery } from "@/queries/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const isAuthReady = useAuthBootstrap();
  const { data: me, isLoading: isMeLoading } = useMeQuery();

  useEffect(() => {
    if (me) {
      router.replace("/resumes");
    }
  }, [me, router]);

  if (!isAuthReady || isMeLoading || me) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>

        <div className="bg-muted relative hidden lg:block"></div>
      </div>
    </div>
  );
}
