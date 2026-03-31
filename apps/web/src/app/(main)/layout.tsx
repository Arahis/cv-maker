import Link from "next/link";
import Navbar from "../(main)/components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar isSticky />
      {children}
      <footer className="mt-12 w-full space-x-8 border-t-2 border-blue-50 px-4 py-6 text-center text-gray-600">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms">Terms</Link>
      </footer>
    </div>
  );
}
