"use client";

import SigninForm from "@/app/(auth)/components/SigninForm";
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
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="my-2 text-center text-xl">
            Guest resume limit reached
          </DialogTitle>
          <DialogDescription className="m-auto w-[80%] text-center">
            Ups! Guest mode includes only one resume. Create an account to make
            and save more resumes.
          </DialogDescription>
        </DialogHeader>
        <SigninForm embedded />
      </DialogContent>
    </Dialog>
  );
}
