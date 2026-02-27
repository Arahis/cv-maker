import PrintClient from "./PrintClient";

export const runtime = "edge";

export const metadata = {
  title: "Print your resume",
  description: "Download your resume (cv) for future usage.",
};

const Page = async () => {
  return (
    <main>
      <PrintClient />
    </main>
  );
};

export default Page;
