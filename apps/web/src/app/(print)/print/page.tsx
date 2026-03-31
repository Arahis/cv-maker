import { Suspense } from "react";
import PrintClient from "./PrintClient";
import Loading from "@/components/Loading";

export const metadata = {
  title: "Print your resume",
  description: "Download your resume (cv) for future usage.",
};

const Page = async () => {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <PrintClient />
      </Suspense>
    </main>
  );
};

export default Page;
