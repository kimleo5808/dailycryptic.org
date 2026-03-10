"use client";

import { NavDropdown } from "@/components/header/NavDropdown";
import { NAV_DROPDOWNS, NAV_STANDALONE_LINKS } from "@/config/nav";
import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const HeaderLinks = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-row items-center gap-x-1 text-sm font-medium">
      {NAV_STANDALONE_LINKS.map((link) => (
        <I18nLink
          key={link.href}
          href={link.href}
          prefetch={true}
          className={cn(
            "rounded-lg px-3 py-2 text-slate-400 transition-colors hover:text-white",
            pathname === link.href && "font-semibold text-white"
          )}
        >
          {link.name}
        </I18nLink>
      ))}

      {NAV_DROPDOWNS.map((dropdown) => (
        <NavDropdown key={dropdown.label} config={dropdown} />
      ))}
    </div>
  );
};

export default HeaderLinks;
