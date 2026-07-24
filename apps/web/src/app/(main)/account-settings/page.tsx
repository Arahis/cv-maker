"use client";

import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import { useAuthBootstrap, useAuthLogout } from "@/providers/auth-bootstrap";
import { useDeleteAccount, useMeQuery } from "@/queries/auth";
import Link from "next/link";

const AccountSettings = () => {
  const isAuthReady = useAuthBootstrap();
  const { isLoggingOut } = useAuthLogout();
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const deleteAccount = useDeleteAccount();
  const { isPending, mutate } = deleteAccount;

  if (!isAuthReady || isMeLoading || isLoggingOut) {
    return <Loading />;
  }

  if (!me) {
    return (
      <main className="mx-auto max-w-250 flex-1 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-xl border border-blue-200 bg-blue-50 p-8 text-center">
          <h1 className="mb-3 text-2xl font-bold">Sign in to continue</h1>
          <p className="mb-6 text-gray-600">
            To access account settings, please log in to your account.
          </p>
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go to home</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  function handleDeleteAccount() {
    if (
      window.confirm(
        "Are you sure you want to permanently delete your account?",
      )
    ) {
      mutate();
    }
  }

  return (
    <main className="mx-auto max-w-250 flex-1 px-4 py-20">
      <p className="mb-2 text-3xl font-bold">Account Settings</p>
      <div className="rounded-xl border border-red-500 bg-red-500/10 p-6">
        <h2 className="mb-2 text-xl font-semibold text-red-600">
          Delete Account
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Deleting your account is permanent and cannot be undone. All your data
          will be lost. Please proceed with caution.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={isPending}
        >
          {isPending ? "Deleting account..." : "Delete Account"}
        </Button>
      </div>
    </main>
  );
};

export default AccountSettings;
