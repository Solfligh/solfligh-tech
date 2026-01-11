import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export default function ContactPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Contact • Inquiries"
        title="Contact SOLFLIGH TECH"
        subtitle="We’re open to projects, contracts, and partnerships. For business inquiries, product work, or job opportunities  reach out and we’ll respond."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">Send a message</div>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            Tell us what you’re building and your timeline. We reply with next steps.
          </p>

          <form className="mt-6 grid gap-4">
            <div>
              <label className="text-sm font-bold text-slate-950">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-950">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-950">Message</label>
              <textarea
                rows={6}
                placeholder="Describe the request, goals, and timeline..."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
              />
            </div>

            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-500"
            >
              Send Message
            </button>

          </form>
        </div>

        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">Business inquiries</div>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            We support collaborations across:
          </p>

          <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-800">
            <li>• Web & software product development</li>
            <li>• Mobile & application builds</li>
            <li>• AI automation & intelligent agents</li>
            <li>• Digital systems & workflow optimization</li>
            <li>• Strategic partnerships and long-term delivery</li>
          </ul>

          <div className="mt-6 rounded-xl border border-sky-300 bg-sky-50 p-4">
            <div className="text-sm font-bold text-sky-900">Job opportunities</div>
            <div className="mt-1 text-xs font-semibold text-slate-800">
              If you’d like to work with SOLFLIGH TECH, send a message with your role, skills, and
              portfolio links.
            </div>
          </div>

          <div className="mt-6 text-sm font-semibold text-slate-800">
            We typically respond within a reasonable timeframe during business days.
          </div>
        </div>
      </div>
    </Container>
  );
}
