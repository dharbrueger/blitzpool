import { useViewport } from "../hooks/useViewport";
import HamburgerMenu from "./HamburgerMenu";
import type { NavLink } from "../types/navigation";
import DesktopMenu from "./DesktopMenu";
import { signOut } from "next-auth/react";

const Navbar: React.FC = () => {
  const { width } = useViewport();
  const mobileBreakpoint = 820;
  const isMobileView = width <= mobileBreakpoint;

  const links: NavLink[] = [
    { url: "/", text: "Dashboard", faIcon: "house" },
    // { url: "/games", text: "Games" },
    { url: "/schedules", text: "Schedules", faIcon: "calendar" },
    // { url: "/support", text: "Support" },
  ];
  
  if (isMobileView) {
    // links.unshift({ url: "/account", text: "Account"});
    links.push({ url: "/logout", text: "Logout", onClick: () => void signOut(), faIcon: "sign-out-alt"});
  }

  return (
    <nav className="flex text-md top-0 w-full uppercase text-slate-400">
      {isMobileView ? (
        <HamburgerMenu links={links}/>
      ) : (
        <DesktopMenu links={links} />
      )}
    </nav>
  );
};

export default Navbar;
