"use client";

import { useVerifyResetPasswordCode } from "@/queries/auth";
import CodeOTPForm from "./CodeOTPForm";

const CodeFormResetPassword = ({ email }: { email: string }) => {
  const { mutateAsync, isPending } = useVerifyResetPasswordCode();

  return <CodeOTPForm email={email} submitForm={mutateAsync} isPending={isPending} />;
};

export default CodeFormResetPassword;
