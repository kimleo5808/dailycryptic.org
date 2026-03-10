"use client";

import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { NavDropdownConfig } from "@/config/nav";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function NavDropdown({ config }: { config: NavDropdownConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = config.sections.some((section) =>
    section.links.some((link) => isLinkActive(pathname, link.href))
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white",
          isActive && "bg-slate-800 text-white"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {config.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[480px] rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
          <div className="grid grid-cols-2 gap-x-6">
            {config.sections.map((section) => (
              <div key={section.title}>
                <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.links.map((link) => (
                    <I18nLink
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      className={cn(
                        "block rounded-lg px-2 py-2 transition-colors hover:bg-slate-800",
                        isLinkActive(pathname, link.href) && "bg-slate-800"
                      )}
                    >
                      <p className="text-sm font-medium text-slate-200">
                        {link.name}
                      </p>
                      {link.description && (
                        <p className="mt-0.5 text-xs leading-snug text-slate-500">
                          {link.description}
                        </p>
                      )}
                    </I18nLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
