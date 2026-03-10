import HeaderLinks from "@/components/header/HeaderLinks";
import MobileMenu from "@/components/header/MobileMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NAV_CTA } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import Image from "next/image";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 px-6 py-3">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-6">
        {/* Logo */}
        <I18nLink
          href="/"
          prefetch={false}
          className="flex flex-shrink-0 items-center space-x-2 font-bold"
        >
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-heading text-lg font-bold text-white">
            {siteConfig.name}
          </span>
        </I18nLink>

        {/* Vertical divider */}
        <div className="hidden h-5 w-px flex-shrink-0 bg-slate-700 md:block" />

        {/* Nav links — standalone + dropdowns */}
        <HeaderLinks />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop: CTA + ThemeToggle */}
        <div className="hidden items-center gap-3 md:flex">
          <I18nLink
            href={NAV_CTA.href}
            prefetch={true}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {NAV_CTA.name} →
          </I18nLink>
          <ThemeToggle />
        </div>

        {/* Mobile: hamburger (includes ThemeToggle inside) */}
        <MobileMenu />
      </nav>
    </header>
  );
};

export default Header;
