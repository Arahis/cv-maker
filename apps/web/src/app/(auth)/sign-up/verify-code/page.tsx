import CodeFormSignup from "../../components/CodeFormSignup";

type PageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function CodeOTPPage({ searchParams }: PageProps) {
  const { email } = await searchParams;

  return <CodeFormSignup email={email ?? ""} />;
}
