// app/products/profitpilot/page.tsx
import { getJereUrl } from "@/app/lib/jereDomain";
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
  const title = "Jèrè (Jere) | Business Software for Nigerian SMEs";
  const description = "Track sales, stock, expenses and customer debts with Jèrè. Business management software for small businesses in Nigeria, with offline entry and estimated profit.";
  return {
    ...metadata,
    title: { absolute: title },
    description,
    alternates: { canonical: getJereUrl() },
    openGraph: { ...metadata.openGraph, title, description, url: getJereUrl() },
    twitter: { ...metadata.twitter, title, description },
  };
}

export default async function ProfitPilotPage() {
  return <ProjectDetailPage params={{ slug: "profitpilot" }} />;
}
