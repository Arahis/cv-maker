import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Resumes",
  description: "Manage your resumes here",
};

const Page = () => {
  return (
    <main>
      <Button asChild className="rounded bg-blue-500 p-4 text-white">
        <Link href="/editor">New Resume</Link>
      </Button>
    </main>
  );
};

export default Page;
