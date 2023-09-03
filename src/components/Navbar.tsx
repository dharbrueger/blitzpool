import { useViewport } from "../hooks/useViewport";
import HamburgerMenu from "./HamburgerMenu";
import type { NavLink } from "../shared/lib/types";
import DesktopMenu from "./DesktopMenu";
import { useSession } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: sessionData } = useSession();
  const { width } = useViewport();
  const mobileBreakpoint = 640;

  const links: NavLink[] = [
    { url: "/account", text: "Account"},
    { url: "/", text: "Dashboard" },
    { url: "/games", text: "Games" },
    { url: "/schedules", text: "Schedules" },
    { url: "/support", text: "Support" },
  ];

  return (
    sessionData ? (
      <nav className="flex text-md top-0 w-full uppercase text-slate-400">
        {width < mobileBreakpoint ? (
          <HamburgerMenu links={links} />
        ) : (
          <DesktopMenu />
        )}
      </nav>
    ) : null
  );
};

export default Navbar;
