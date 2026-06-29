"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import z from "zod";
import { useState } from "react";

export const verifyCodeBodySchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Code must contain 6 digits"),
});

export type VerifyCodeBody = z.infer<typeof verifyCodeBodySchema>;

type CodeOTPFormProps = {
  submitForm: (data: VerifyCodeBody & { email: string }) => Promise<unknown>;
  isPending: boolean;
  email: string;
};

const useCodeOTPForm = () =>
  useForm({
    resolver: zodResolver(verifyCodeBodySchema),
    defaultValues: {
      code: "",
    },
  });

const CodeOTPForm = ({ submitForm, isPending, email }: CodeOTPFormProps) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const isLoading = isPending || isNavigating;

  const form = useCodeOTPForm();

  const onSubmit = async (data: VerifyCodeBody) => {
    if (!email) {
      console.error("Email is required");
      return;
    }

    setIsNavigating(true);

    try {
      // Success and redirect are handled in the useVerifyCode hook
      await submitForm({ ...data, email });
    } catch (error) {
      setIsNavigating(false);
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Digits Only</FormLabel>
              <FormControl>
                <InputOTP
                  {...field}
                  id="digits-only"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Verifying code..." : "Verify Code"}
        </Button>
      </form>
    </Form>
  );
};

export default CodeOTPForm;
