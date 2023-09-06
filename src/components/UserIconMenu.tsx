import { useState } from "react";
import { FaUser, FaSignOutAlt, FaBell } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const UserIconMenu = () => {
  const {data: sessionData} = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="text-white">
      <div className="flex mr-4 text-black">
        <div
          className="items-center font-semibold transitionhover:bg-white/80 flex cursor-pointer rounded-[20px] text-white mr-4"
          onClick={toggleMenu}
        >
          <div className="flex items-center justify-center py-4 px-12 bg-[#283441] rounded-[80px]">
            <FaUser className="h-6 w-6 mr-4" />
            <div className='font-light'>{sessionData?.user.name}</div>
          </div>
        </div>
        <div className="items-center font-semibold transitionhover:bg-white/80 flex cursor-pointer rounded-[20px] text-white">
          <FaBell className="h-6 w-6 mr-4" />
        </div>
        {isMenuOpen && (
          <div className="absolute right-16 mt-16 divide-y divide-gray-100 bg-[#283441] text-bp-primary shadow-lg rounded-[80px] cursor-pointer">
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
