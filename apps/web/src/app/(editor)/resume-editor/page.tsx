import { Suspense } from "react";
import ResumeEditorPageClient from "./ResumeEditorPageClient";
import Loading from "@/components/Loading";

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
      <Suspense fallback={<Loading />}>
        <ResumeEditorPageClient />
      </Suspense>
    </main>
  );
};

export default Page;
