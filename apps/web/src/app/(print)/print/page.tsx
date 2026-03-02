import { Suspense } from "react";
import PrintClient from "./PrintClient";

export const metadata = {
  title: "Print your resume",
  description: "Download your resume (cv) for future usage.",
};

const Page = async () => {
  return (
    <main>
      <Suspense
        fallback={<div className="h-96 w-full animate-pulse bg-gray-200" />}
      >
        <PrintClient />
      </Suspense>
    </main>
  );
};

export default Page;
