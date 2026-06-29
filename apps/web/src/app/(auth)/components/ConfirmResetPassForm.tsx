"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { FieldDescription, FieldGroup } from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordResetPasswordBodySchema,
  ForgotPasswordResetPasswordBody,
} from "@cv-maker/shared";
import Link from "next/link";
import { useResetPassword } from "@/queries/auth";
import { useState } from "react";

const useSigninForm = () =>
  useForm({
    resolver: zodResolver(forgotPasswordResetPasswordBodySchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

const ConfirmResetPassForm = () => {
  const form = useSigninForm();
  const { mutateAsync, isPending } = useResetPassword();

  const [isNavigating, setIsNavigating] = useState(false);
  const isLoading = isPending || isNavigating;

  const onSubmit = async (data: ForgotPasswordResetPasswordBody) => {
    setIsNavigating(true);

    try {
      mutateAsync(data);
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
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Reset your password</h1>
          </div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Enter your new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating password..." : "Update Password"}
          </Button>
          <FieldDescription className="px-6 text-center">
            You can return to <Link href="/sign-in">Sign in</Link> or{" "}
            <Link href="/sign-up">Sign up</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default ConfirmResetPassForm;
