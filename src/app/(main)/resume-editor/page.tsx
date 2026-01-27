export const runtime = "edge";

import ResumeEditorPageClient from "./ResumeEditorPageClient";

export const metadata = {
  title: "Editor",
  description: "Create and edit your resumes here",
};

const Page = async () => {
  return (
    <main className="">
      <ResumeEditorPageClient />
    </main>
  );
};

export default Page;
