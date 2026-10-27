// app/products/profitpilot/page.tsx
import { getJereUrl, jereDomainEnabled, JERE_DOMAIN_ORIGIN, JERE_ICON_PATH } from "@/app/lib/jereDomain";
import { SITE_URL } from "@/app/lib/site";
import ProjectDetailPage, { generateMetadata as projectMetadata } from "../[slug]/page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// This static route takes precedence over [slug], including its metadata exports.
export async function generateMetadata() {
  const metadata = await projectMetadata({ params: { slug: "profitpilot" } });
  if (metadata.robots && typeof metadata.robots === "object" && metadata.robots.index === false) {
    return metadata;
  }
  const title = "Jèrè (Jere) | Sales, Online Orders & Service Jobs";
  const description = "Manage product sales, online orders, service jobs, invoices and returns with Jèrè for small businesses in Nigeria and across Africa. Plus adds offline entry.";
  const icon = `${jereDomainEnabled() ? JERE_DOMAIN_ORIGIN : SITE_URL}${JERE_ICON_PATH}`;
  return {
    ...metadata,
    title: { absolute: title },
    description,
    icons: {
      icon: [{ url: icon, type: "image/png", sizes: "512x512" }],
      shortcut: [icon],
      apple: [{ url: icon, type: "image/png", sizes: "512x512" }],
    },
    alternates: { canonical: getJereUrl() },
    openGraph: { ...metadata.openGraph, title, description, url: getJereUrl(), siteName: "Jèrè" },
    twitter: { ...metadata.twitter, title, description },
  };
}

export default async function ProfitPilotPage() {
  return <ProjectDetailPage params={{ slug: "profitpilot" }} />;
}
