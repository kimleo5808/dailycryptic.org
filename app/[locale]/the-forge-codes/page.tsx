import HomeComponent from "@/components/home";
import { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "TheForgeCodes",
    title: "The Forge Codes (February 2026): Active & Expired + Last Verified",
    description:
      "Get the latest the forge codes with active and expired status, timestamps, redeem steps, and transparent updates.",
    locale: locale as Locale,
    path: "/the-forge-codes",
    canonicalUrl: "/",
  });
}

export default function TheForgeCodesPage() {
  return <HomeComponent />;
}

