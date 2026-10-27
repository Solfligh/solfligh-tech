import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/app/components/Container";
import JereOfflineWalkthrough from "@/app/components/JereOfflineWalkthrough";
import { generateMetadata as landingMetadata } from "../page";
import { listProjects } from "@/app/lib/projectStore";
import { getProduct } from "@/app/lib/products";
import { getJereUrl } from "@/app/lib/jereDomain";
import { JERE_AUDIENCE, JERE_DESCRIPTION, JERE_OFFLINE_ANSWER, JERE_REVIEWED, getJereGuideUrl, jereFeatures, jereQuestions, jereOfflineSteps } from "@/app/lib/jereKnowledge";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const base = await landingMetadata();
  if (base.robots && typeof base.robots === "object" && base.robots.index === false) return base;
  const title = "Record Sales Offline in Nigeria | Jèrè (Jere) Plus Guide";
  const description = "Record shop sales without internet with Jèrè Plus. Follow the phone setup, offline entry and reconnection steps, with a practice illustration and clear limits.";
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
    name: "Record sales offline in Nigeria with Jèrè Plus", description: JERE_OFFLINE_ANSWER,
    dateModified: JERE_REVIEWED, inLanguage: "en",
    isPartOf: { "@id": `${getJereUrl()}#website` },
    about: { "@id": `${getJereUrl()}#application` },
  };
  return <main className="bg-[#fbfaf7] py-12 text-[#201c33] sm:py-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <Container className="max-w-4xl">
      <Link href={getJereUrl()} className="text-sm font-semibold text-[#5546e8] underline underline-offset-4">← Jèrè home</Link>
      <p className="mt-8 text-sm font-semibold text-[#7765be]">Live / Near Launch · Product guide</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Record sales offline for your shop in Nigeria.</h1>
      <p className="mt-6 text-lg leading-relaxed">{JERE_OFFLINE_ANSWER}</p>
      <p className="mt-4 text-sm text-[#625c70]">Product information reviewed <time dateTime={JERE_REVIEWED}>27 October 2026</time> by SOLFLIGH TECH.</p>
      <nav aria-label="Guide contents" className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#5546e8]">
        <a href="#offline-walkthrough" className="underline underline-offset-4">Try the walkthrough</a>
        <a href="#offline-limits" className="underline underline-offset-4">Check offline limits</a>
        <a href="#guide-features" className="underline underline-offset-4">All Jèrè features</a>
      </nav>
      <section id="offline-walkthrough" className="mt-12 scroll-mt-36 border-t border-[#e5e0ef] pt-8">
        <h2 className="text-2xl font-semibold">How to record sales when the internet goes down</h2>
        <p className="mt-4 leading-relaxed text-[#625c70]">Use these steps on the same phone you prepared online. To practise with made-up sales, use a separate practice account so you do not mix them into your real business records.</p>
        <ol className="mt-7 space-y-6">{jereOfflineSteps.map((step, i) => <li key={step.title} className="flex gap-4"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9e5ff] text-sm font-semibold text-[#5546e8]">{i + 1}</span><div><h3 className="text-lg font-semibold">{step.title}</h3><p className="mt-2 leading-relaxed text-[#625c70]">{step.text}</p></div></li>)}</ol>
        <JereOfflineWalkthrough />
        <a href={`${product.appUrl}help#offline`} className="mt-6 inline-block font-semibold text-[#5546e8] underline underline-offset-4">Open Jèrè’s offline help →</a>
      </section>
      <section id="offline-limits" className="mt-12 scroll-mt-36 border-t border-[#e5e0ef] pt-8">
        <h2 className="text-2xl font-semibold">What works offline on Basic and Plus?</h2>
        <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[480px] border-collapse text-left text-sm"><caption className="mb-3 text-left text-[#625c70]">Offline availability after the phone has been prepared online</caption><thead><tr className="border-b border-[#d8d1ed]"><th scope="col" className="p-3">Task</th><th scope="col" className="p-3">Basic</th><th scope="col" className="p-3">Plus</th></tr></thead><tbody>{[
          ["Record sales, customer payments, expenses and new products", "Needs internet", "Save entries on this phone; send on reconnection"],
          ["Check stock", "Needs internet", "Last saved stock, adjusted for entries waiting on this phone"],
          ["Read Today and Owing figures", "Needs internet", "Saved views with your PIN; their age is shown"],
          ["Add customers, change existing prices or stock, cancel sales", "Needs internet", "Needs internet"],
          ["Update shared records and business figures", "Needs internet", "Waiting entries count after they have been sent"],
        ].map(row => <tr key={row[0]} className="border-b border-[#e5e0ef]"><th scope="row" className="p-3 align-top font-medium">{row[0]}</th><td className="p-3 align-top text-[#625c70]">{row[1]}</td><td className="p-3 align-top text-[#625c70]">{row[2]}</td></tr>)}</tbody></table></div>
        <p className="mt-5 rounded-xl border border-[#d8d1ed] bg-[#f1eef8] p-5 text-sm leading-relaxed">Keep entries waiting to send on the same phone. Clearing browser storage, resetting the phone or removing its saved app data can remove unsent entries. If an entry needs attention, check its message before recording it again.</p>
        <p className="mt-4 text-sm leading-relaxed text-[#625c70]">Offline recording saves the sale’s details. Confirm bank transfers and card payments through your usual bank or POS provider.</p>
      </section>
      <section className="mt-12 border-t border-[#e5e0ef] pt-8">
        <h2 className="text-2xl font-semibold">Who is Jèrè for?</h2>
        <p className="mt-4 leading-relaxed text-[#625c70]">{JERE_DESCRIPTION}</p>
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
