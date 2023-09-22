import React, { useRef, useState } from "react";
import type { NavLink } from "~/shared/lib/types";
import NavLinkRenderer from "./NavLinkRenderer";
import LogoImage from "public/logo.png";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";
import { useClickAway } from "react-use";

interface HamburgerMenuProps {
  links: NavLink[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function handleClickOutside() {
    setIsMenuOpen(false);
  }

  useClickAway(menuRef, handleClickOutside);

  return (
    <div className="flex w-full items-center p-8">
      <div className="max-w-[50%]">
        <Link href="/">
          <Image src={LogoImage} alt="The Blitzpool logo." quality={100} />
        </Link>
      </div>
      <div className="ml-auto">
        <div ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div
            className={`top-30 z-10 absolute right-8 rounded-[10px] bg-[#283441] px-6 py-2 font-light text-white shadow-md ${
              !isMenuOpen ? "hidden" : ""
            }`}
          >
            <ul>
              <NavLinkRenderer links={links} showIcons />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
