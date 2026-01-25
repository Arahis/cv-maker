import { Metadata } from "next";
import ResumeClient from "./ResumeClient";

export const metadata: Metadata = {
  title: "List of resumes",
  description: "Manage your resumes here",
};

const Page = () => {
  return (
    <main className="py-28 text-center">
      <h1 className="mb-20 text-2xl font-semibold md:text-3xl">
        Wow! All these are your resumes
      </h1>
      <div className="mx-20">
        <ResumeClient />
      </div>
    </main>
  );
};

export default Page;
