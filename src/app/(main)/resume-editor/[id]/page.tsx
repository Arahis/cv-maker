import ResumeApp from "../components/ResumeApp";

export const metadata = {
  title: "Editor",
  description: "Create and edit your resumes here",
};

const Page = ({ params }: { params: { id: string } }) => {
  const resumeId = params.id;

  return (
    <main className="">
      <div className="flex w-full">
        <ResumeApp resumeId={resumeId} />
      </div>
    </main>
  );
};

export default Page;
