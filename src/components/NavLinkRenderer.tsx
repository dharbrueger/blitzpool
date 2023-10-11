import type { NavLink } from "~/types/navigation";

interface NavLinkRendererProps {
  links: NavLink[];
  className?: string;
  isHorizontal?: boolean;
  showIcons?: boolean;
}

const NavLinkRenderer: React.FC<NavLinkRendererProps> = ({
  links,
  className,
  isHorizontal = false,
  showIcons = false,
}) => {
  const applyVerticalMargin = (index: number, length: number) => {
    if (index === 0) {
      return "mt-6 mb-8";
    }

    if (index === length) {
      return "";
    } else {
      return "mb-8";
    }
  };

  return (
    <ul className={`${className ?? ""} ${isHorizontal ? "flex" : ""} select-none`}>
      {links.map((link, index) =>
        link.onClick ? (
          // Render an <li> element with onClick handler
          <li
            key={index}
            className={
              isHorizontal ? "mx-6" : applyVerticalMargin(index, links.length)
            }
          >
            {showIcons && link.faIcon && (
              <i className={`fa mr-4 text-xl text-white fa-${link.faIcon}`}></i>
            )}
            <button
              onClick={link.onClick}
              className="uppercase hover:text-white"
            >
              {link.text}
            </button>
          </li>
        ) : (
          // Render a regular <li> element with an anchor tag
          <li
            key={index}
            className={
              isHorizontal ? "mx-4" : applyVerticalMargin(index, links.length)
            }
          >
            {showIcons && link.faIcon && (
              <i className={`fa mr-4 text-xl text-white fa-${link.faIcon}`}></i>
            )}
            <a href={link.url} className="hover:text-white">
              {link.text}
            </a>
          </li>
        )
      )}
    </ul>
  );
};

export default NavLinkRenderer;
