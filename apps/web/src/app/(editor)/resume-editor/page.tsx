import { Suspense } from "react";
import ResumeEditorPageClient from "./ResumeEditorPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resume editor",
  description: "Create and edit your resume.",
  robots: {
    index: false,
    follow: false,
  },
};

const Page = async () => {
  return (
    <main className="mx-auto min-h-0 w-full max-w-400 flex-1">
      <Suspense
        fallback={<div className="h-96 w-full animate-pulse bg-gray-200" />}
      >
        <ResumeEditorPageClient />
      </Suspense>
    </main>
  );
};

export default Page;
