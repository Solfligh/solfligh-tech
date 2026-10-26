// app/products/profitpilot/page.tsx
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
  const title = "Jèrè (Jere) — Business management software for small businesses in Nigeria";
  return {
    ...metadata,
    title: { absolute: `${title} | SOLFLIGH TECH` },
    openGraph: { ...metadata.openGraph, title },
    twitter: { ...metadata.twitter, title },
  };
}

export default async function ProfitPilotPage() {
  return <ProjectDetailPage params={{ slug: "profitpilot" }} />;
}
