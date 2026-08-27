import CodeFormResetPassword from "../../components/CodeFormResetPassword";

const VerifyCodePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) => {
  const { email } = await searchParams;

  return <CodeFormResetPassword email={email ?? ""} />;
};

export default VerifyCodePage;
