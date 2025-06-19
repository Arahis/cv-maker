import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav>
        <Link href="/" className="text-2xl font-bold">
          ResuMe
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
