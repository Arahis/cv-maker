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
    <main className="py-12 text-center md:py-28">
      <h1 className="mb-10 text-xl font-semibold md:text-3xl">
        Wow! All these are your resumes
      </h1>
      <div className="mx-2 mb-12 flex justify-center gap-4">
        <CreateResumeButtonResumeList />
        <UploadResumeButtonResumeList />
      </div>
      <div className="mx-10">
        <ResumeList />
      </div>
    </main>
  );
};

export default Page;
