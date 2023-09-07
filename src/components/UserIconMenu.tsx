import { useState } from "react";
import { FaUser, FaSignOutAlt, FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

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
      <div className="mr-4 flex text-black">
        <div
          className="transitionhover:bg-white/80 mr-4 flex cursor-pointer items-center rounded-[20px] font-semibold text-white"
          onClick={toggleMenu}
        >
          <div className="flex items-center justify-center rounded-[80px] bg-[#283441] hover:bg-[#303f4e] px-12 py-4 select-none">
            <FaUser className="mr-4 h-6 w-6" />
            <div className="font-light">{sessionData?.user.name}</div>
          </div>
        </div>
        <div className="transitionhover:bg-white/80 flex cursor-pointer items-center rounded-[20px] font-semibold text-white">
          <FaBell className="mr-4 h-6 w-6" />
        </div>
        {isMenuOpen && (
          <div className="absolute right-16 mt-16 cursor-pointer rounded-[10px] bg-[#283441] text-white shadow-lg">
            <button
              disabled
              onClick={() => {
                void signOut();
                closeMenu();
              }}
              className="flex items-center px-8 py-2 uppercase text-slate-600 cursor-not-allowed"
            >
              <FaUser className="mr-2" />
              Account
            </button>
            <div
              onClick={() => {
                void signOut();
                closeMenu();
              }}
              className="flex items-center px-8 py-2"
            >
              <FaSignOutAlt className="mr-2" />
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserIconMenu;
