import { Metadata } from "next";
import CreateNewResumeButton from "./CreateNewResumeButton";
import ResumeList from "./ResumeList";

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
      <div className="mb-12">
        <CreateNewResumeButton />
      </div>
      <div className="mx-20">
        <ResumeList />
      </div>
    </main>
  );
};

export default Page;
