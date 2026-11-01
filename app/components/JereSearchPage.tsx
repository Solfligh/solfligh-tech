import Link from "next/link";
import Container from "@/app/components/Container";
import { getProduct } from "@/app/lib/products";
import { getJereUrl, getJereGuideUrl } from "@/app/lib/jereDomain";
import { JERE_DESCRIPTION } from "@/app/lib/jereKnowledge";
import { JERE_SEARCH_PAGES_REVIEWED, getJereSearchPage, getJereSearchUrl, type JereSearchPage as Page } from "@/app/lib/jereSearchPages";

/** One short page that answers one question a small business owner might type into a search engine. */
export default function JereSearchPage({ page }: { page: Page }) {
  const product = getProduct("profitpilot")!;
  const url = getJereSearchUrl(page.slug);
  const schema = [
    {
      "@context": "https://schema.org", "@type": "WebPage",
      "@id": `${url}#webpage`, url, name: page.h1, description: page.description,
      dateModified: JERE_SEARCH_PAGES_REVIEWED, inLanguage: "en",
      isPartOf: { "@id": `${getJereUrl()}#website` },
      about: { "@id": `${getJereUrl()}#application` },
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
  ];
  const related = page.related.map((slug) => getJereSearchPage(slug)).filter((p): p is Page => Boolean(p));
  return (
    <main className="bg-[#fbfaf7] py-12 text-[#201c33] sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <Container className="max-w-3xl">
        <Link href={getJereUrl()} className="text-sm font-semibold text-[#5546e8] underline underline-offset-4">← Jèrè home</Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">{page.h1}</h1>
        <p className="mt-6 text-lg leading-relaxed">{page.answer}</p>
        <p className="mt-4 text-sm text-[#625c70]">
          Checked against the product on <time dateTime={JERE_SEARCH_PAGES_REVIEWED}>1 November 2026</time> by SOLFLIGH TECH.
        </p>

        <section className="mt-12 border-t border-[#e5e0ef] pt-8" aria-labelledby="steps">
          <h2 id="steps" className="text-2xl font-semibold">{page.stepsTitle}</h2>
          <ol className="mt-6 list-decimal space-y-4 pl-6 leading-relaxed text-[#625c70]">
            {page.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </section>

        <section className="mt-10 rounded-xl border border-[#d8d1ed] bg-[#f1eef8] p-6" aria-labelledby="good-to-know">
          <h2 id="good-to-know" className="text-xl font-semibold">Good to know</h2>
          <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed text-[#625c70]">
            {page.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </section>

        <section className="mt-12 border-t border-[#e5e0ef] pt-8" aria-labelledby="questions">
          <h2 id="questions" className="text-2xl font-semibold">Common questions</h2>
          <div className="mt-6 space-y-6">
            {page.faqs.map((f) => (
              <article key={f.question}>
                <h3 className="text-lg font-semibold">{f.question}</h3>
                <p className="mt-2 leading-relaxed text-[#625c70]">{f.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-[#211a3a] p-7 text-white">
          <h2 className="text-2xl font-semibold">Try Jèrè with your business</h2>
          <p className="mt-4 leading-relaxed">{JERE_DESCRIPTION.split(". ")[0]}. Open for sign-up in early access. We will tell you before we start to charge.</p>
          <div className="mt-6 flex flex-wrap gap-6 font-semibold">
            <a href={product.ctaHref} className="underline underline-offset-4">Create your account →</a>
            <a href={`${product.appUrl}sign-in`} className="underline underline-offset-4">Sign in</a>
          </div>
        </section>

        <nav aria-label="More short answers" className="mt-12 border-t border-[#e5e0ef] pt-8">
          <h2 className="text-xl font-semibold">More short answers</h2>
          <ul className="mt-4 space-y-2 font-semibold text-[#5546e8]">
            {related.map((r) => <li key={r.slug}><a href={getJereSearchUrl(r.slug)} className="underline underline-offset-4">{r.h1}</a></li>)}
            <li><a href={getJereGuideUrl()} className="underline underline-offset-4">The full Jèrè guide</a></li>
          </ul>
        </nav>
      </Container>
    </main>
  );
}
