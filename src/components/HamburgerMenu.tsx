import React, { useState } from "react";
import type { NavLink } from "~/shared/lib/types";
import NavLinkRenderer from "./NavLinkRenderer";
import LogoImage from "public/logo.png";
import Image from "next/image";

interface HamburgerMenuProps {
  links: NavLink[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex p-8">
      <div className="max-w-[50%]">
        <Image src={LogoImage} alt="The Blitzpool logo." quality={100} />
      </div>
      <div className="ml-auto">
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
            className={`absolute right-8 top-20 rounded-[20px] bg-[#283441] px-12 py-6 text-white font-light shadow-md`}
          >
            <ul>
              <NavLinkRenderer links={links} showIcons />
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HamburgerMenu;
