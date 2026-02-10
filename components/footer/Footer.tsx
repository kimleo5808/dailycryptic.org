import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import { FooterLink } from "@/types/common";
import { GithubIcon, MailIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Footer() {
  const t = await getTranslations("Home");
  const tFooter = await getTranslations("Footer");

  const footerLinks: FooterLink[] = tFooter.raw("Links.groups");

  return (
    <footer className="mt-12 w-full border-t border-orange-100 bg-slate-950 text-slate-300 dark:border-orange-900/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-white">{t("title")}</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            {t("description")}
          </p>
          <div className="mt-5 flex items-center gap-2">
            {siteConfig.socialLinks?.github && (
              <Link
                href={siteConfig.socialLinks.github}
                prefetch={false}
                target="_blank"
                rel="noreferrer nofollow noopener"
                aria-label="GitHub"
                title="View on GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 hover:bg-slate-800"
              >
                <GithubIcon className="size-4" />
              </Link>
            )}
            {siteConfig.socialLinks?.email && (
              <Link
                href={`mailto:${siteConfig.socialLinks.email}`}
                prefetch={false}
                aria-label="Email"
                title="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 hover:bg-slate-800"
              >
                <MailIcon className="size-4" />
              </Link>
            )}
          </div>
        </div>

        {footerLinks.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              {section.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("/") && !link.useA ? (
                    <I18nLink
                      href={link.href}
                      title={link.name}
                      prefetch={false}
                      className="text-slate-400 transition-colors hover:text-white"
                      target={link.target || undefined}
                      rel={link.rel || undefined}
                    >
                      {link.name}
                    </I18nLink>
                  ) : (
                    <Link
                      href={link.href}
                      title={link.name}
                      prefetch={false}
                      className="text-slate-400 transition-colors hover:text-white"
                      target={link.target || undefined}
                      rel={link.rel || undefined}
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-slate-400 sm:px-6 md:flex-row lg:px-8">
          <p>
            {tFooter("Copyright", {
              year: new Date().getFullYear(),
              name: siteConfig.name,
            })}
          </p>
          <div className="flex items-center gap-4">
            <I18nLink
              href="/privacy-policy"
              title={tFooter("PrivacyPolicy")}
              prefetch={false}
              className="hover:text-white"
            >
              {tFooter("PrivacyPolicy")}
            </I18nLink>
            <I18nLink
              href="/terms-of-service"
              title={tFooter("TermsOfService")}
              prefetch={false}
              className="hover:text-white"
            >
              {tFooter("TermsOfService")}
            </I18nLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
