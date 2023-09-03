import React, { useState } from "react";
import type { NavLink } from "~/shared/lib/types";
import NavLinkRenderer from "./NavLinkRenderer";

interface HamburgerMenuProps {
  links: NavLink[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="ml-auto p-8">
      <button onClick={toggleMenu} className="text-white focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={toggleMenu}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {isMenuOpen && (
        <div
          className={`absolute right-8 top-20 transform-gpu rounded-lg bg-white px-12 py-6 shadow-md ${
            isMenuOpen
              ? "scale-y-100 opacity-100 transition-opacity duration-300"
              : "scale-y-0 opacity-0 transition-opacity duration-300"
          }`}
        >
          <ul className="text-black">
            <NavLinkRenderer links={links} />
          </ul>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
