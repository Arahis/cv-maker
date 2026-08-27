"use client";
import { useVerifyCode } from "@/queries/auth";
import CodeOTPForm from "./CodeOTPForm";

const CodeFormSignup = ({ email }: { email: string }) => {
  const { mutateAsync, isPending } = useVerifyCode();

  return (
    <CodeOTPForm email={email} submitForm={mutateAsync} isPending={isPending} />
  );
};

export default CodeFormSignup;
