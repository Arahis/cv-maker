import ResumeApp from "../components/ResumeApp";

export const metadata = {
  title: "Editor",
  description: "Create and edit your resumes here",
};

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <main className="">
      <div className="flex w-full">
        <ResumeApp resumeId={id} />
      </div>
    </main>
  );
};

export default Page;
