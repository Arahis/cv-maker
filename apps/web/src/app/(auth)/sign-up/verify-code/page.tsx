import { Suspense } from "react";
import CodeFormSignup from "../../components/CodeFormSignup";
import Loading from "@/components/Loading";

export default async function CodeOTPPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CodeFormSignup />
    </Suspense>
  );
}
