import { useState } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const UserIconMenu = () => {
  const { data: sessionData } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="text-white">
      {sessionData && (
        <div className="relative inline-block text-black mr-4">
          <div
            className="flex cursor-pointer items-centerfont-semibold no-underline rounded-full outline outline-2 outline-white transitionhover:bg-white/80"
            onClick={toggleMenu}
          >
            {sessionData.user.image ? (
              <Image
                src={sessionData.user.image}
                width={36}
                height={36}
                alt="User Avatar"
                className="rounded-full"
              />
            ) : (
              <FaUser className="h-6 w-6 rounded-full" />
            )}
          </div>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md divide-y divide-gray-100">
              <a
                onClick={() => {
                  void signOut();
                  closeMenu();
                }}
                className="px-8 py-2 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2"/>
                Logout
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserIconMenu;
