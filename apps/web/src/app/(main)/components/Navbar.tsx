"use client";

import Logo from "@/assets/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLogout, useMeQuery } from "@/queries/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { useAuthBootstrap } from "@/providers/auth-bootstrap";

function SignInButton() {
  return (
    <Button
      variant="ghost"
      asChild
      className="link-hover px-4 py-2 text-base font-bold"
    >
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}

export function HeaderAuth() {
  const isAuthReady = useAuthBootstrap();
  const { data: me, isLoading } = useMeQuery();
  const logoutMutation = useLogout();

  if (isAuthReady && isLoading) {
    return (
      <Button
        variant="ghost"
        disabled
        className="px-4 py-2 text-base font-bold opacity-70"
      >
        Loading...
      </Button>
    );
  }

  if (me) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="link-hover px-4 py-2 text-base font-bold"
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "My Account"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{me.user.email}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/account-settings">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <SignInButton />;
}

const Navbar = ({ isSticky }: { isSticky?: boolean }) => {
  const isAuthReady = useAuthBootstrap();
  const { data: me, isLoading: isMeLoading } = useMeQuery();

  return (
    <header
      className={cn(
        "bg-background top-0 z-50 border-b-2 border-blue-50",
        isSticky && "sticky",
      )}
    >
      <nav
        className="mx-auto flex h-18 max-w-400 items-center justify-between p-4 lg:p-2"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Logo width="120" />
            <span className="sr-only">Cvoop.com logo</span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            asChild
            className="link-hover px-4 py-2 text-base font-bold"
          >
            <Link href="/plans">Plans</Link>
          </Button>

          {isAuthReady && !isMeLoading && me && (
            <Button
              variant="ghost"
              asChild
              className="link-hover px-4 py-2 text-base font-bold"
            >
              <Link href="/resumes">Your resumes</Link>
            </Button>
          )}

          <HeaderAuth />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
