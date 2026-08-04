import Link from "next/link";
import Navbar from "../(main)/components/Navbar";
import { ResumeActionProvider } from "./providers/ResumeActionProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ResumeActionProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar isSticky />
        <div className="flex-1">{children}</div>
        <footer className="w-full space-x-8 border-t-2 border-blue-50 px-4 py-6 text-center text-gray-600">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/cookie-policy">Cookie Policy</Link>
          <Link href="/terms">Terms</Link>
        </footer>
      </div>
    </ResumeActionProvider>
  );
}
