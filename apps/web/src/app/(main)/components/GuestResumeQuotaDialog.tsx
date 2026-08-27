"use client";

import SignupForm from "@/app/(auth)/components/SignupForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function GuestResumeQuotaDialog({
  open,
  onOpenChange,
  source,
  hasEverUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: "create" | "upload";
  hasEverUploaded: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-trigger={source}>
        <DialogHeader>
          <DialogTitle className="my-2 text-center text-xl">
            {source === "upload"
              ? hasEverUploaded
                ? "You’ve used your free resume upload"
                : "Want to try resume upload?"
              : "You already have a resume"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {source === "upload" ? (
              hasEverUploaded ? (
                <>
                  Guest users can upload and parse{" "}
                  <Link href="/resumes" className="text-primary font-semibold">
                    one resume
                  </Link>
                  . Create a free account to upload another CV and create more
                  resumes.
                </>
              ) : (
                <>
                  Guest users can keep one resume at a time. Delete your{" "}
                  <Link href="/resumes" className="text-primary font-semibold">
                    current resume
                  </Link>{" "}
                  to upload and parse an existing CV, or create a free account
                  to keep both.
                </>
              )
            ) : (
              <>
                Guest users can keep one resume at a time. Delete your{" "}
                <Link href="/resumes" className="text-primary font-semibold">
                  current resume
                </Link>{" "}
                to start a new one, or create a free account to keep both.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <SignupForm embedded />
      </DialogContent>
    </Dialog>
  );
}
