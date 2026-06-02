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
import { loginBodySchema } from "@cv-maker/shared";
import Link from "next/link";

const useSigninForm = () =>
  useForm({
    resolver: zodResolver(loginBodySchema.pick({ email: true })),
    defaultValues: {
      email: "",
    },
  });

const ResetPassForm = () => {
  const form = useSigninForm();
  const isPending = false; // TODO: implement password reset mutation and set this state accordingly

  // const onSubmit = (data: LoginBody["email"]) => {
  //   mutate(data);
  // };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        // onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Reset your password</h1>
          </div>
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

          <Button type="submit" disabled={isPending}>
            {isPending ? "Resetting password..." : "Reset Password"}
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

export default ResetPassForm;
