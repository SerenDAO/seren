import NavItemProps from "../type/NavItemProps";
import Link from "next/link";

export function NavItem({ href, title }: NavItemProps) {
    return (
      <li className="font-sans font-semibold text-lg">
        <Link href={href}>{title}</Link>
      </li>
    );
}