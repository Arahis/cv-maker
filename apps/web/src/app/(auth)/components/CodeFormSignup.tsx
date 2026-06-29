"use client";
import { useVerifyCode } from "@/queries/auth";
import CodeOTPForm from "./CodeOTPForm";

const CodeFormSignup = ({ email }: { email: string }) => {
  const { mutateAsync, isPending } = useVerifyCode();

  return (
    <CodeOTPForm submitForm={mutateAsync} isPending={isPending} email={email} />
  );
};

export default CodeFormSignup;
