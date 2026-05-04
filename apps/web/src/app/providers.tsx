import React from "react";
import QueryProvider from "@/providers/query-provider";
import { AuthBootstrap } from "@/providers/auth-bootstrap";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthBootstrap>{children}</AuthBootstrap>
    </QueryProvider>
  );
};

export default Providers;
