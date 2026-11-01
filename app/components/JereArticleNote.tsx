import Container from "@/app/components/Container";
import { getJereUrl } from "@/app/lib/jereDomain";
import { getJereSearchPage, getJereSearchUrl } from "@/app/lib/jereSearchPages";

/**
 * A short, plain pointer at the end of an article about running a small business: where to see the idea in practice in Jèrè.
 * It links to one of the short answer pages and to the product.
 */
export default function JereArticleNote({ slug }: { slug: string }) {
  const page = getJereSearchPage(slug);
  if (!page) return null;
  return (
    <section aria-label="Try this in Jèrè" className="pb-16">
      <Container>
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Try it in Jèrè</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Jèrè (Jere) is business management software for small businesses in Nigeria. Record your sales and expenses and see your estimated profit.
          </p>
          <p className="mt-3 text-sm font-semibold">
            <a href={getJereSearchUrl(page.slug)} className="text-slate-900 underline underline-offset-4">{page.h1}</a>
            <span className="mx-2 text-slate-400">·</span>
            <a href={getJereUrl()} className="text-slate-900 underline underline-offset-4">About Jèrè</a>
          </p>
        </div>
      </Container>
    </section>
  );
}
