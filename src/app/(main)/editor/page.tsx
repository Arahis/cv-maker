import React from "react";
import ResumeApp from "./components/ResumeApp";

export const metadata = {
  title: "Editor",
  description: "Create and edit your resumes here",
};

const Page = () => {
  return (
    <main className="">
      <div className="flex w-full">
        <ResumeApp />
      </div>
    </main>
  );
};

export default Page;
