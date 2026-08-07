"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/queries/auth";
import { SignupBody, signupBodySchema } from "@cv-maker/shared";
import Link from "next/link";
import { useState } from "react";
import GoogleSignInButton from "./GoogleSignInButton";

const useSignupForm = () =>
  useForm({
    resolver: zodResolver(signupBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const SignupForm = ({
  embedded = false,
  onShowSignin,
}: {
  embedded?: boolean;
  onShowSignin?: () => void;
}) => {
  const { mutateAsync, isPending, error } = useSignUp();
  const form = useSignupForm();
  const [isNavigating, setIsNavigating] = useState(false);

  const isLoading = isPending || isNavigating;

  const onSubmit = async (data: SignupBody) => {
    setIsNavigating(true);

    try {
      await mutateAsync(data);
    } catch (error) {
      setIsNavigating(false);
      console.error(error);
    }
    // TODO: handle success and error cases, e.g., show a notification or redirect on success
  };

  const errorMessage = error
    ? (() => {
        try {
          return JSON.parse(error.message).error ?? "Unable to sign up";
        } catch {
          return "Unable to sign up. Please try again.";
        }
      })()
    : null;

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          {!embedded && (
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-2xl font-bold">Create new account</h1>
            </div>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="m@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </FormItem>
            )}
          />

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating ..." : "Create Account"}
          </Button>
          <GoogleSignInButton />
          <FieldDescription className="px-4 text-center">
            Already have an account?{" "}
            {onShowSignin ? (
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={onShowSignin}
              >
                Sign in
              </button>
            ) : (
              <Link href="/sign-in">Sign in</Link>
            )}
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default SignupForm;
