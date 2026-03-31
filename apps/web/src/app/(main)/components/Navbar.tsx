import Logo from "@/assets/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DonateLink from "./DonateLink";

const Navbar = ({ isSticky }: { isSticky?: boolean }) => {
  return (
    <header
      className={cn(
        "bg-background top-0 z-50 border-b-2 border-blue-50",
        isSticky && "sticky",
      )}
    >
      <nav
        className="mx-auto flex h-18 max-w-400 items-center justify-between p-4 lg:p-2"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Logo width="120" />
            <span className="sr-only">Cvoop.com logo</span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <DonateLink />

          <Link href="/resumes" className="link-hover px-4 py-2 font-bold">
            Your resumes here
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
