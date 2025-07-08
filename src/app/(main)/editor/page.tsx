import React from "react";
import ResumeEditor from "./ResumeEditor";
import CreateResumeSteps from "./createResumeSteps";

export const metadata = {
  title: "Editor",
  description: "Create and edit your resumes here",
};

const Page = () => {
  return (
    <div>
      <ResumeEditor />
    </div>
  );
};

export default Page;
