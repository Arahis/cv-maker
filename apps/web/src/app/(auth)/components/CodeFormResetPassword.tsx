"use client";

import { useVerifyResetPasswordCode } from "@/queries/auth";
import CodeOTPForm from "./CodeOTPForm";

const CodeFormResetPassword = () => {
  const { mutateAsync, isPending } = useVerifyResetPasswordCode();

  return <CodeOTPForm submitForm={mutateAsync} isPending={isPending} />;
};

export default CodeFormResetPassword;
