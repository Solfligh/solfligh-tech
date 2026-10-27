import { jereFeatures as features, jereQuestions as questions, jereApplicationSchema, getJereGuideUrl } from "@/app/lib/jereKnowledge";
import Image from "next/image";
import Link from "next/link";
import Container from "@/app/components/Container";
import { getProduct } from "@/app/lib/products";
import { listPostsByHub } from "@/app/lib/insightsStore";
import { SITE_URL } from "@/app/lib/site";



const screens = [
  { src: "/projects/profitpilot/sales.jpg", title: "Keep a record of each sale", text: "See sales and share receipts with customers.", alt: "Jèrè sales screen with a list of sales and receipt sharing, using a practice business" },
  { src: "/projects/profitpilot/stock.jpg", title: "Check what is in stock", text: "See your products and the ones running low.", alt: "Jèrè stock screen showing products and low-stock flags, using a practice business" },
  { src: "/projects/profitpilot/team.jpg", title: "Choose what your team sees", text: "Give each team member the access their work needs.", alt: "Jèrè team screen showing cashier access permissions, using a practice business" },
];



function SignupLinks({ dark = false }: { dark?: boolean }) {
  const product = getProduct("profitpilot")!;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <a href={product.ctaHref} className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500 ${dark ? "bg-[#d9d4ff] text-[#171331] hover:bg-white" : "bg-[#5546e8] text-white hover:bg-[#4335cc]"}`}>
        {product.ctaLabel}<span aria-hidden="true">↗</span>
      </a>
      <a href={`${product.appUrl}sign-in`} className={`inline-flex min-h-12 items-center px-2 py-3 text-sm font-semibold underline decoration-current/30 underline-offset-4 ${dark ? "text-white" : "text-[#292344]"}`}>
        Sign in
      </a>
    </div>
  );
}

export default function JereProductLanding({ status = "Live / Near Launch" }: { status?: string }) {
  const articles = listPostsByHub("profitpilot").slice(0, 3);
  const schema = jereApplicationSchema();

  return (
    <main className="bg-[#fbfaf7] text-[#201c33]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${schema.url}#website`, name: "Jèrè", alternateName: "Jere", url: schema.url, description: schema.description }).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="overflow-hidden border-b border-[#e5e0ef] bg-[radial-gradient(ellipse_at_top_right,#e9e5ff,transparent_65%)]">
        <Container>
          <div className="grid items-start gap-12 py-12 sm:py-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-4xl font-bold tracking-tight">jèrè</p>
                <span className="rounded-full border border-[#d4dccc] bg-[#f0f4ea] px-3 py-1.5 text-xs font-semibold text-[#456039]">{status}</span>
              </div>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">Know what you sold.<br /><span className="text-[#5546e8]">See your estimated profit.</span></h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#625c70] sm:text-lg">Run your business with Jèrè (Jere). Track sales, stock, expenses and debts, check your cash and see estimated profit. Built for small businesses in Nigeria, with offline recording on Plus.</p>
              <a href="#offline" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#ccd9c2] bg-[#f0f4ea] px-4 py-2 text-sm font-semibold text-[#456039]"><span aria-hidden="true">↻</span> Works offline with Plus <span aria-hidden="true">↓</span></a>
              <div className="mt-8"><SignupLinks /></div>
              <p className="mt-4 text-sm text-[#70697e]">Open for sign-up in early access.</p>
              <Link href={getJereGuideUrl()} className="mt-4 inline-block text-sm font-semibold text-[#5546e8] underline underline-offset-4">Read the Jèrè product guide →</Link>
              <a href="#how-it-works" className="mt-8 inline-flex gap-2 text-sm font-medium text-[#5546e8]">See how Jèrè fits your day <span aria-hidden="true">↓</span></a>
            </div>
            <figure className="mx-auto w-full max-w-[310px] lg:max-w-[330px]">
              <div className="rounded-[2rem] border border-[#d8d1ed] bg-[#edeafa] p-3 shadow-[0_24px_70px_-35px_rgba(62,44,112,0.5)] sm:p-4">
                <Image src="/projects/profitpilot/today.jpg" alt="Jèrè Today screen showing sales, item costs and estimated profit for a practice business" width={1305} height={2616} sizes="(max-width: 640px) 280px, 300px" preload className="h-auto w-full rounded-[1.3rem]" />
              </div>
              <figcaption className="mt-3 text-center text-xs leading-relaxed text-[#746d83]">Practice business with made-up figures.<br />Not real customer results.</figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <section className="border-b border-[#e5e0ef] bg-white py-6" aria-label="Built for your working day">
        <Container className="grid gap-4 text-center text-sm font-medium text-[#625c70] sm:grid-cols-3">
          <p>Cash, transfer, POS and credit sales</p><a href="#offline" className="font-semibold text-[#5546e8]">Offline recording with Plus</a><p>Choose what each team member sees</p>
        </Container>
      </section>

      <section id="offline" className="scroll-mt-36 border-b border-[#e5e0ef] bg-[#f1eef8] py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#7765be]">Offline with Jèrè Plus</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">Internet down?<br />Keep recording your business.</h2>
              <p className="mt-5 text-base leading-relaxed text-[#625c70]">A lost connection should not leave your next sale on a scrap of paper. Jèrè keeps entries on your phone and sends them automatically when you are back online.</p>
              <Link href={`${getJereGuideUrl()}#offline-walkthrough`} className="mt-6 inline-block text-sm font-semibold text-[#5546e8] underline underline-offset-4">Follow the offline sales walkthrough →</Link>
            </div>
            <div className="rounded-2xl border border-[#d8d1ed] bg-white p-6 sm:p-8">
              <h3 className="text-lg font-semibold">What you can do offline</h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-[#625c70]">
                <li><strong className="text-[#201c33]">Record sales and customer payments.</strong> Keep the time each entry happened, including credit sales for customers already saved.</li>
                <li><strong className="text-[#201c33]">Add expenses and products.</strong> Owners can add a new product and start selling it on that phone.</li>
                <li><strong className="text-[#201c33]">Check saved stock.</strong> See the last saved product list and counts, adjusted for sales waiting on that phone.</li>
                <li><strong className="text-[#201c33]">Read saved figures with your PIN.</strong> Owners can open saved Today and Owing figures, clearly marked with their age.</li>
              </ul>
            </div>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Open online first", "Sign in and let Sell load to save your products and customer names. Open Today and Owing online with your PIN set to keep those figures too."],
              ["Save on your phone", "When the connection drops, use the offline tabs. The waiting list shows what has been saved and what still needs to be sent."],
              ["Reconnect and send", "Jèrè sends waiting entries automatically. They count in your business records once sent. Entries that need attention stay visible with a reason."],
            ].map(([title, text], index) => <li key={title} className="rounded-2xl border border-[#d8d1ed] p-5"><p className="text-xs font-semibold text-[#7765be]">0{index + 1}</p><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-[#625c70]">{text}</p></li>)}
          </ol>
          <p className="mt-6 max-w-4xl text-sm leading-relaxed text-[#625c70]">Offline use is part of Plus; Basic works online. Saved views are the last copy on that phone. Adding customers, changing existing prices or stock, cancelling sales and account changes need internet. Keep the phone’s browser data until all waiting entries have been sent.</p>
        </Container>
      </section>

      <section id="features" className="scroll-mt-28 py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#7765be]">Your working day, in one place</p><h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">From the first sale<br />to closing your books.</h2></div>
            <p className="self-end text-base text-[#625c70]">Keep the records behind your business together: what you sold, what you spent, who owes you and who you need to pay. Check cash, staff pay and product performance without losing sight of estimated profit.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-[#e5e0ef] bg-white p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7765be]">{feature.label}</p>
                <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#625c70]">{feature.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e5e0ef] p-6"><h3 className="text-lg font-semibold">Keep private figures behind a PIN</h3><p className="mt-3 text-sm leading-relaxed text-[#625c70]">Set the app lock to cover your figures when you leave Jèrè. Use your PIN to unlock it when you return.</p></div>
            <div className="rounded-2xl border border-[#e5e0ef] p-6"><h3 className="text-lg font-semibold">Download your business records</h3><p className="mt-3 text-sm leading-relaxed text-[#625c70]">Download your records from My data and account whenever you need a copy outside Jèrè.</p></div>
          </div>
        </Container>
      </section>

      <section className="bg-[#211a3a] py-16 text-white sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#beb0fa]">A clearer view of profit</p><h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">See what is left after the costs.</h2><p className="mt-5 text-base text-[#d1c8e1]">A sale brings money into the picture. The cost of the goods and your business expenses belong there too. Jèrè brings them together to show estimated profit.</p></div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
            <p className="text-sm text-[#d1c8e1]">How the estimate works</p>
            <div className="mt-5 space-y-3 text-lg"><p>Sales</p><p className="text-[#d1c8e1]">− Cost of the items sold</p><p className="text-[#d1c8e1]">− Recorded expenses</p><p className="border-t border-white/20 pt-4 text-xl font-semibold text-[#ded6ff]">= Estimated profit</p></div>
            <p className="mt-5 text-sm text-[#d1c8e1]">The estimate depends on the records you enter. Credit sales can count towards profit before customers have paid you.</p>
            <Link href={`${SITE_URL}/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity`} className="mt-5 inline-block text-sm font-semibold text-[#ded6ff] underline underline-offset-4">Understand cashflow and profit →</Link>
          </div>
        </Container>
      </section>

      <section id="screens" className="scroll-mt-28 py-16 sm:py-24">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#7765be]">Inside Jèrè</p><h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Take a look before you sign up.</h2>
          <p className="mt-4 max-w-xl text-base text-[#625c70]">These screens show a practice business with made-up figures. They are examples of the app, not customer results.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {screens.map((screen) => (
              <figure key={screen.src} className="overflow-hidden rounded-2xl border border-[#e5e0ef] bg-white">
                <div className="bg-[#eeebfa] px-8 py-7"><Image src={screen.src} alt={screen.alt} width={1305} height={2616} sizes="(max-width: 767px) 280px, 300px" className="mx-auto h-auto w-full max-w-[270px] rounded-2xl" /></div>
                <figcaption className="p-6"><h3 className="text-lg font-semibold">{screen.title}</h3><p className="mt-2 text-sm text-[#625c70]">{screen.text}</p></figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-28 border-y border-[#e5e0ef] bg-[#f1eef8] py-16 sm:py-20">
        <Container>
          <h2 className="text-3xl font-semibold sm:text-4xl">Build it into your daily routine.</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ["Record as you trade", "Enter sales and payments, keep stock up to date and record business expenses as they happen."],
              ["Check before you close", "Review estimated profit, see outstanding customer debts and count your cash against your records."],
              ["Look back and plan", "Compare a day, week, month or year with the period before. See which products make you the most money."],
            ].map(([title, text], index) => (
              <li key={title}><span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#cfc5e9] text-sm font-semibold text-[#67559e]">0{index + 1}</span><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm text-[#625c70]">{text}</p></li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="questions" className="scroll-mt-28 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#7765be]">Before you get started</p><h2 className="mt-4 text-3xl font-semibold sm:text-4xl">A few useful answers.</h2><p className="mt-5 text-sm text-[#625c70]">Have another question? <Link href={`${SITE_URL}/contact`} className="font-semibold text-[#5546e8] underline underline-offset-4">Talk to SOLFLIGH TECH.</Link></p></div>
          <div className="divide-y divide-[#e5e0ef] border-y border-[#e5e0ef]">
            {questions.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="cursor-pointer text-base font-semibold marker:text-[#7765be]">{item.question}</summary>
                <p className="mt-4 pr-4 text-sm text-[#625c70]">{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container><div className="rounded-3xl bg-[#211a3a] px-6 py-12 text-white sm:px-12 sm:py-16"><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#beb0fa]">Jèrè by SOLFLIGH TECH</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">Give your next business day a clearer record.</h2><p className="mt-5 max-w-xl text-base text-[#d1c8e1]">Start recording your sales, stock, expenses and customer debts with Jèrè. Open for sign-up in early access.</p><div className="mt-8"><SignupLinks dark /></div></div></Container>
      </section>

      {articles.length > 0 ? <section className="border-t border-[#e5e0ef] bg-white py-14"><Container><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-semibold">Make sense of your business numbers.</h2><Link href={`${SITE_URL}/insights/profitpilot`} className="text-sm font-semibold text-[#5546e8] underline underline-offset-4">Jèrè insights →</Link></div><div className="mt-8 grid gap-6 md:grid-cols-3">{articles.map((article) => <Link key={article.href} href={`${SITE_URL}${article.href}`} className="rounded-2xl border border-[#e5e0ef] p-6 transition hover:border-[#a99ce0]"><p className="text-xs font-medium text-[#7765be]">{article.tag}</p><h3 className="mt-3 text-lg font-semibold">{article.title}</h3><p className="mt-3 text-sm text-[#625c70]">{article.description}</p><span className="mt-5 inline-block text-sm font-semibold text-[#5546e8]">Read article →</span></Link>)}</div></Container></section> : null}
    </main>
  );
}
