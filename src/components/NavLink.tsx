import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { NavItemContent } from "./NavItem";

type NavLinkProps = {
  icon: ReactNode;
  label: string;
} & Omit<LinkProps, "children" | "activeProps" | "inactiveProps">;

/** Bottom-nav entry that navigates to a route and highlights when active. */
export function NavLink({ icon, label, ...linkProps }: NavLinkProps) {
  return (
    <Link
      {...linkProps}
      aria-label={label}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {({ isActive }) => (
        <NavItemContent icon={icon} label={label} active={isActive} />
      )}
    </Link>
  );
}
