import { Metadata } from "next";
import CreateResumeButtonResumeList from "./components/CreateResumeButtonResumeList";
import UploadResumeButtonResumeList from "./components/UploadResumeButtonResumeList";
import ResumeList from "./components/ResumeList";

export const metadata: Metadata = {
  title: "Your resumes",
  description: "Manage your resumes.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const Page = () => {
  return (
    <main className="py-28 text-center">
      <h1 className="mb-10 text-2xl font-semibold md:text-3xl">
        Wow! All these are your resumes
      </h1>
      <div className="mb-12 flex justify-center gap-4">
        <CreateResumeButtonResumeList />
        <UploadResumeButtonResumeList />
      </div>
      <div className="mx-20">
        <ResumeList />
      </div>
    </main>
  );
};

export default Page;
