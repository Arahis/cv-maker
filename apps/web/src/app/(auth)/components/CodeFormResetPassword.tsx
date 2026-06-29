"use client";

import { useVerifyResetPasswordCode } from "@/queries/auth";
import CodeOTPForm from "./CodeOTPForm";

const CodeFormResetPassword = ({ email }: { email: string }) => {
  const { mutateAsync, isPending } = useVerifyResetPasswordCode();

  return (
    <CodeOTPForm submitForm={mutateAsync} isPending={isPending} email={email} />
  );
};

export default CodeFormResetPassword;
