import Image from "next/image";
import Link from "next/link";
import Container from "@/app/components/Container";
import { getProduct } from "@/app/lib/products";
import { listPostsByHub } from "@/app/lib/insightsStore";
import { SITE_URL } from "@/app/lib/site";

const features = [
  { title: "Record every sale", text: "Cash, transfer, POS or credit. Record part-payments and share a receipt through WhatsApp or another app you choose.", label: "Sales & receipts" },
  { title: "Know what is on the shelf", text: "Keep a stock list, record restocking and spot products running low before the next customer asks for them.", label: "Stock" },
  { title: "Keep expenses in the picture", text: "Record transport, electricity, rent and other business costs. Set reminders for expenses that come round regularly.", label: "Expenses" },
  { title: "Remember who owes you", text: "Keep customer debts and payments together. See what is still owed and send a reminder yourself.", label: "Customer debts" },
  { title: "Give your team the right access", text: "Invite a cashier by code and choose what they can see. Cashiers can record sales without seeing your costs or profit.", label: "Team access" },
  { title: "Keep recording when the internet drops", text: "Record sales, payments, expenses and new products offline. Your entries are sent when you are back online.", label: "Offline entry" },
];

const screens = [
  { src: "/projects/profitpilot/sales.jpg", title: "Keep a record of each sale", text: "See sales and share receipts with customers.", alt: "Jèrè sales screen with a list of sales and receipt sharing, using a practice business" },
  { src: "/projects/profitpilot/stock.jpg", title: "Check what is in stock", text: "See your products and the ones running low.", alt: "Jèrè stock screen showing products and low-stock flags, using a practice business" },
  { src: "/projects/profitpilot/team.jpg", title: "Choose what your team sees", text: "Give each team member the access their work needs.", alt: "Jèrè team screen showing cashier access permissions, using a practice business" },
];

const questions = [
  { question: "What is Jèrè?", answer: "Jèrè (Jere) is business management software for small businesses in Nigeria. It brings sales, stock, expenses and customer debts together so you can see your estimated profit. It is built by SOLFLIGH TECH with an Africa-first focus." },
  { question: "Can I sign up now?", answer: "Yes. Jèrè is open for sign-up in early access. Choose Create your account to get started, or sign in if you already have an account. We will tell you before we start to charge." },
  { question: "Does Jèrè work without internet?", answer: "You can record sales, payments, expenses and new products when the internet is down. Those entries are sent when you are back online." },
  { question: "Is money collected the same as profit?", answer: "Money collected and profit answer different questions. Jèrè estimates profit by taking the cost of the goods sold and your recorded expenses away from sales. That can include credit sales customers have not paid for yet. Your estimate depends on the records you enter." },
  { question: "Can my cashier use Jèrè without seeing my profit?", answer: "Yes. You can invite a cashier by code and choose their access. Cashiers can record sales without seeing your costs or profit." },
  { question: "Do I need to download an app?", answer: "Jèrè runs in your browser. You can also add it to your phone’s home screen." },
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
  const canonical = `${SITE_URL}/products/profitpilot`;
  const articles = listPostsByHub("profitpilot").slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${canonical}#application`,
    name: "Jèrè",
    alternateName: "Jere",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Business management software for small businesses in Nigeria. Record sales, stock, expenses and customer debts, and see your estimated profit.",
    url: canonical,
    image: `${SITE_URL}/projects/profitpilot/today.jpg`,
    publisher: { "@type": "Organization", name: "SOLFLIGH TECH", url: SITE_URL },
  };

  return (
    <main className="bg-[#fbfaf7] text-[#201c33]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="overflow-hidden border-b border-[#e5e0ef] bg-[radial-gradient(ellipse_at_top_right,#e9e5ff,transparent_65%)]">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd7ec] py-6">
            <Link href="/products" className="text-xs font-semibold uppercase tracking-[.16em] text-[#645c78]">SOLFLIGH TECH / Products</Link>
            <nav aria-label="On this page" className="flex gap-5 text-sm font-medium text-[#645c78]">
              <a href="#features" className="hover:text-[#5546e8]">Features</a>
              <a href="#screens" className="hover:text-[#5546e8]">Screens</a>
              <a href="#questions" className="hover:text-[#5546e8]">FAQs</a>
            </nav>
          </div>
          <div className="grid items-start gap-12 py-12 sm:py-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-4xl font-bold tracking-tight">jèrè</p>
                <span className="rounded-full border border-[#d4dccc] bg-[#f0f4ea] px-3 py-1.5 text-xs font-semibold text-[#456039]">{status}</span>
              </div>
              <h1 className="mt-7 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.5rem]">Know what you sold.<br /><span className="text-[#5546e8]">See your estimated profit.</span></h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#625c70] sm:text-lg">Jèrè (Jere) is business management software for small businesses in Nigeria. Record sales, stock, expenses and customer debts in one place.</p>
              <div className="mt-8"><SignupLinks /></div>
              <p className="mt-4 text-sm text-[#70697e]">Open for sign-up in early access.</p>
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
          <p>Cash, transfer, POS and credit sales</p><p>Record entries when the internet drops</p><p>Choose what each team member sees</p>
        </Container>
      </section>

      <section id="features" className="scroll-mt-28 py-16 sm:py-24">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#7765be]">Your working day, in one place</p><h2 className="mt-4 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">The sale. The stock.<br />The money still owed.</h2></div>
            <p className="self-end text-base text-[#625c70]">Sales come in as cash, transfers and POS payments. Stock needs replacing. Some customers pay later. Jèrè keeps those records together, so you can check what happened and what needs attention.</p>
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
        </Container>
      </section>

      <section className="bg-[#211a3a] py-16 text-white sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#beb0fa]">A clearer view of profit</p><h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">See what is left after the costs.</h2><p className="mt-5 text-base text-[#d1c8e1]">A sale brings money into the picture. The cost of the goods and your business expenses belong there too. Jèrè brings them together to show estimated profit.</p></div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
            <p className="text-sm text-[#d1c8e1]">How the estimate works</p>
            <div className="mt-5 space-y-3 text-lg"><p>Sales</p><p className="text-[#d1c8e1]">− Cost of the items sold</p><p className="text-[#d1c8e1]">− Recorded expenses</p><p className="border-t border-white/20 pt-4 text-xl font-semibold text-[#ded6ff]">= Estimated profit</p></div>
            <p className="mt-5 text-sm text-[#d1c8e1]">The estimate depends on the records you enter. Credit sales can count towards profit before customers have paid you.</p>
            <Link href="/insights/profitpilot/cashflow-vs-profit-why-mixing-them-up-costs-clarity" className="mt-5 inline-block text-sm font-semibold text-[#ded6ff] underline underline-offset-4">Understand cashflow and profit →</Link>
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
          <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#7765be]">Before you get started</p><h2 className="mt-4 text-3xl font-semibold sm:text-4xl">A few useful answers.</h2><p className="mt-5 text-sm text-[#625c70]">Have another question? <Link href="/contact" className="font-semibold text-[#5546e8] underline underline-offset-4">Talk to SOLFLIGH TECH.</Link></p></div>
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

      {articles.length > 0 ? <section className="border-t border-[#e5e0ef] bg-white py-14"><Container><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-semibold">Make sense of your business numbers.</h2><Link href="/insights/profitpilot" className="text-sm font-semibold text-[#5546e8] underline underline-offset-4">Jèrè insights →</Link></div><div className="mt-8 grid gap-6 md:grid-cols-3">{articles.map((article) => <Link key={article.href} href={article.href} className="rounded-2xl border border-[#e5e0ef] p-6 transition hover:border-[#a99ce0]"><p className="text-xs font-medium text-[#7765be]">{article.tag}</p><h3 className="mt-3 text-lg font-semibold">{article.title}</h3><p className="mt-3 text-sm text-[#625c70]">{article.description}</p><span className="mt-5 inline-block text-sm font-semibold text-[#5546e8]">Read article →</span></Link>)}</div></Container></section> : null}
    </main>
  );
}
