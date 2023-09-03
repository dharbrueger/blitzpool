import React, { useState } from "react";

interface HamburgerMenuProps {
  links: Link[];
}

interface Link {
  text: string;
  url: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ links }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const applyMargin = (index: number, length: number) => {
    if (index === 0) {
      return 'mt-6 mb-6'
    }

    if (index === length) {
      return '';
    } else {
      return 'mb-6'
    }
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
            {links.map((link, index) => (
              <li key={index} className={applyMargin(index, links.length)}>
                <a href={link.url} className="hover:text-blue-500">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
