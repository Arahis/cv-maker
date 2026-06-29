"use client";
import { useVerifyCode } from "@/queries/auth";
import CodeOTPForm from "./CodeOTPForm";

const CodeFormSignup = () => {
  const { mutateAsync, isPending } = useVerifyCode();

  return <CodeOTPForm submitForm={mutateAsync} isPending={isPending} />;
};

export default CodeFormSignup;
