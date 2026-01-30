import ResumeEditorPageClient from "./ResumeEditorPageClient";

export const runtime = "edge";

export const metadata = {
  title: "Editor",
  description: "Create and edit your resumes here",
};

const Page = async () => {
  return (
    <main>
      <ResumeEditorPageClient />
    </main>
  );
};

export default Page;
