"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NAV_CTA,
  NAV_DROPDOWNS,
  NAV_STANDALONE_LINKS,
} from "@/config/nav";
import { Link as I18nLink } from "@/i18n/routing";
import { Menu } from "lucide-react";

export default function MobileMenu() {
  return (
    <div className="flex items-center gap-1 md:hidden">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 text-slate-300 hover:text-white">
          <Menu className="h-5 w-5" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {/* CTA at top */}
          <DropdownMenuLabel className="p-2">
            <I18nLink
              href={NAV_CTA.href}
              prefetch={true}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              {NAV_CTA.name} →
            </I18nLink>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Standalone links */}
          <DropdownMenuGroup>
            {NAV_STANDALONE_LINKS.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <I18nLink href={link.href} prefetch={true} className="w-full cursor-pointer">
                  {link.name}
                </I18nLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          {/* Dropdown groups with section labels */}
          {NAV_DROPDOWNS.map((dropdown) => (
            <div key={dropdown.label}>
              {dropdown.sections.map((section, sectionIdx) => (
                <div key={section.title}>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {section.title}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {section.links.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <I18nLink
                          href={link.href}
                          prefetch={true}
                          className="w-full cursor-pointer"
                        >
                          {link.name}
                        </I18nLink>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </div>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
