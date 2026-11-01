import { notFound } from "next/navigation";
import JereSearchPage from "@/app/components/JereSearchPage";
import { generateMetadata as landingMetadata } from "../../page";
import { listProjects } from "@/app/lib/projectStore";
import { getJereSearchPage, getJereSearchUrl, jereSearchSlugs } from "@/app/lib/jereSearchPages";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }> | { slug: string };

export function generateStaticParams() {
  return jereSearchSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const base = await landingMetadata();
  if (base.robots && typeof base.robots === "object" && base.robots.index === false) return base;
  const page = getJereSearchPage((await params).slug);
  if (!page) return { ...base, robots: { index: false, follow: true } };
  const url = getJereSearchUrl(page.slug);
  return {
    ...base,
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: { ...base.openGraph, title: page.title, description: page.description, url },
    twitter: { ...base.twitter, title: page.title, description: page.description },
  };
}

export default async function JereLearnPage({ params }: { params: Params }) {
  const page = getJereSearchPage((await params).slug);
  if (!page) notFound();
  const project = (await listProjects()).find((p) => p.slug === "profitpilot" && p.published);
  if (!project) notFound();
  return <JereSearchPage page={page} />;
}
