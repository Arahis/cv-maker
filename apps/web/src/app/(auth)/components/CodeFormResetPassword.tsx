"use client";

import { useVerifyResetPasswordCode } from "@/queries/auth";
import CodeOTPForm from "./CodeOTPForm";
import { Suspense } from "react";
import Loading from "@/components/Loading";

const CodeFormResetPassword = () => {
  const { mutateAsync, isPending } = useVerifyResetPasswordCode();

  return (
    <Suspense fallback={<Loading />}>
      <CodeOTPForm submitForm={mutateAsync} isPending={isPending} />
    </Suspense>
  );
};

export default CodeFormResetPassword;
