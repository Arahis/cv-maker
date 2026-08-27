import CodeFormSignup from "../../components/CodeFormSignup";

export default async function CodeOTPPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <CodeFormSignup email={email ?? ""} />;
}
