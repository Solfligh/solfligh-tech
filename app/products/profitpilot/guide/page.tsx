import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/app/components/Container";
import { generateMetadata as landingMetadata } from "../page";
import { listProjects } from "@/app/lib/projectStore";
import { getProduct } from "@/app/lib/products";
import { getJereUrl } from "@/app/lib/jereDomain";
import { JERE_AUDIENCE, JERE_DESCRIPTION, JERE_REVIEWED, getJereGuideUrl, jereFeatures, jereQuestions } from "@/app/lib/jereKnowledge";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const base = await landingMetadata();
  if (base.robots && typeof base.robots === "object" && base.robots.index === false) return base;
  const title = "Jèrè (Jere) Guide | Offline Sales, Stock and Debts in Nigeria";
  const description = "See who Jèrè is for, how offline recording on Plus works, and how to track stock, sales, debts and estimated profit. Includes requirements and limitations.";
  return { ...base, title: { absolute: title }, description,
    alternates: { canonical: getJereGuideUrl() },
    openGraph: { ...base.openGraph, title, description, url: getJereGuideUrl() },
    twitter: { ...base.twitter, title, description },
  };
}

export default async function JereGuide() {
  const project = (await listProjects()).find(p => p.slug === "profitpilot" && p.published);
  if (!project) notFound();
  const product = getProduct("profitpilot")!;
  const schema = {
    "@context": "https://schema.org", "@type": "WebPage",
    "@id": `${getJereGuideUrl()}#webpage`, url: getJereGuideUrl(),
    name: "Jèrè product guide", description: JERE_DESCRIPTION,
    dateModified: JERE_REVIEWED, inLanguage: "en",
    isPartOf: { "@id": `${getJereUrl()}#website` },
    about: { "@id": `${getJereUrl()}#application` },
  };
  return <main className="bg-[#fbfaf7] py-12 text-[#201c33] sm:py-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <Container className="max-w-4xl">
      <Link href={getJereUrl()} className="text-sm font-semibold text-[#5546e8] underline underline-offset-4">← Jèrè home</Link>
      <p className="mt-8 text-sm font-semibold text-[#7765be]">Live / Near Launch · Product guide</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Sales, stock and debts with Jèrè.</h1>
      <p className="mt-6 text-lg leading-relaxed">{JERE_DESCRIPTION}</p>
      <p className="mt-4 text-sm text-[#625c70]">Product information reviewed <time dateTime={JERE_REVIEWED}>26 October 2026</time> by SOLFLIGH TECH.</p>
      <section className="mt-12 border-t border-[#e5e0ef] pt-8">
        <h2 className="text-2xl font-semibold">Who is Jèrè for?</h2>
        <p className="mt-4 leading-relaxed text-[#625c70]">{JERE_AUDIENCE}</p>
        <p className="mt-4 leading-relaxed text-[#625c70]">If you need to record a sale during an internet outage, check stock (inventory) before selling, follow up on customer debts or compare sales with costs, the features below explain what Jèrè can help you do.</p>
      </section>
      <section className="mt-12 border-t border-[#e5e0ef] pt-8" aria-labelledby="guide-features">
        <h2 id="guide-features" className="text-2xl font-semibold">What can you manage?</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">{jereFeatures.map(f => <article key={f.label} className="rounded-xl border border-[#e5e0ef] bg-white p-5"><h3 className="text-lg font-semibold">{f.label}</h3><p className="mt-3 leading-relaxed text-[#625c70]">{f.text}</p></article>)}</div>
        <p className="mt-6 leading-relaxed text-[#625c70]">You can also lock private figures behind a PIN and download your business records from My data and account.</p>
      </section>
      <section className="mt-12 border-t border-[#e5e0ef] pt-8">
        <h2 className="text-2xl font-semibold">Offline use, plans and common questions</h2>
        <p className="mt-4 leading-relaxed text-[#625c70]">Check the offline requirements before relying on Jèrè without a connection. Plus supports offline entry; Basic works online.</p>
        <div className="mt-8 space-y-8">{jereQuestions.map(q => <article key={q.question}><h3 className="text-xl font-semibold">{q.question}</h3><p className="mt-3 leading-relaxed text-[#625c70]">{q.answer}</p></article>)}</div>
        <a href={`${product.appUrl}help#offline`} className="mt-6 inline-block font-semibold text-[#5546e8] underline underline-offset-4">Read the offline setup guide →</a>
      </section>
      <section className="mt-12 rounded-2xl bg-[#211a3a] p-7 text-white">
        <h2 className="text-2xl font-semibold">Try Jèrè with your business</h2>
        <p className="mt-4 leading-relaxed">Open for sign-up in early access. We will tell you before we start to charge.</p>
        <div className="mt-6 flex flex-wrap gap-6 font-semibold"><a href={product.ctaHref} className="underline underline-offset-4">Create your account →</a><a href={`${product.appUrl}sign-in`} className="underline underline-offset-4">Sign in</a></div>
      </section>
    </Container>
  </main>;
}
