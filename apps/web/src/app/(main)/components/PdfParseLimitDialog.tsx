"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PdfParseLimitDialog({
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
          <DialogTitle className="text-center text-xl">
            PDF parsing limit reached
          </DialogTitle>
          <DialogDescription className="text-center">
            You have used all 3 PDF imports included with your free account.
            Upgrade to a paid plan to continue importing resumes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            Coming soon
          </span>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button disabled>Upgrade plan</Button>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
