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
import { LoginBody, loginBodySchema } from "@cv-maker/shared";
import { useLogin } from "@/queries/auth";
import Link from "next/link";

const useSigninForm = () =>
  useForm({
    resolver: zodResolver(loginBodySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

const SigninForm = ({
  embedded = false,
  onShowSignup,
}: {
  embedded?: boolean;
  onShowSignup?: () => void;
}) => {
  const { mutate, isPending, error } = useLogin();
  const form = useSigninForm();

  const onSubmit = (data: LoginBody) => {
    mutate(data);
    // TODO: handle success and error cases, e.g., show a notification or redirect on success
  };

  const errorMessage = error
    ? (() => {
        try {
          return JSON.parse(error.message).error ?? "Unable to log in";
        } catch {
          return "Unable to log in. Please try again.";
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
              <h1 className="text-2xl font-bold">Log in to your account</h1>
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
                  Forgot your password?{" "}
                  <Link href="/forgot-password">Reset it here</Link>
                </FieldDescription>
              </FormItem>
            )}
          />

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Enter Account"}
          </Button>
          <FieldDescription className="px-6 text-center">
            Don't have an account?{" "}
            {onShowSignup ? (
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={onShowSignup}
              >
                Sign up
              </button>
            ) : (
              <Link href="/sign-up">Sign up</Link>
            )}
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default SigninForm;
