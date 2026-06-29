import CodeFormResetPassword from "../../components/CodeFormResetPassword";

type PageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

const VerifyCodePage = async ({ searchParams }: PageProps) => {
  const { email } = await searchParams;

  return <CodeFormResetPassword email={email ?? ""} />;
};

export default VerifyCodePage;
