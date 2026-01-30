import ResumeEditorPageClient from "./ResumeEditorPageClient";

export const runtime = "edge";

export const metadata = {
  title: "Editor",
  description: "Create and edit your resumes here",
};

const Page = async () => {
  return (
    <main className="mx-auto min-h-0 w-full max-w-400 flex-1">
      <ResumeEditorPageClient />
    </main>
  );
};

export default Page;
