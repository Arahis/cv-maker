import Logo from "@/assets/logo";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-background sticky top-0 z-50">
      <nav
        className="mx-auto flex h-18 max-w-300 items-center justify-between"
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
        <div>
          <a
            href="https://paypal.me/cvoop"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hover mr-2 px-4 py-2 font-bold"
          >
            Donation
          </a>

          <Link href="/resumes" className="link-hover px-4 py-2 font-bold">
            Your resumes here
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
