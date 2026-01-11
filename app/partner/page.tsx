import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";

export default function PartnerPage() {
  return (
    <Container className="py-14 md:py-20">
      <PageHeader
        badge="Partner • Collaboration"
        title="Partner With SOLFLIGH TECH"
        subtitle="We collaborate with startups, businesses, and individuals on high-quality software, automation systems, intelligent agents, and long-term product co-development."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">Ways to collaborate</div>

          <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-800">
            <li>• Project collaboration (build together, faster)</li>
            <li>• Strategic partnerships (long-term delivery & growth)</li>
            <li>• Product co-development (from MVP to scale)</li>
            <li>• AI automation & intelligent agents</li>
            <li>• Systems design & workflow optimization</li>
          </ul>

          <div className="mt-6 rounded-xl border border-sky-300 bg-sky-50 p-4">
            <div className="text-sm font-bold text-sky-900">Our promise</div>
            <div className="mt-1 text-xs font-semibold text-slate-800">
              Clear communication, product-grade execution, and scalable engineering  delivered
              like a real technology partner.
            </div>
          </div>

          <div className="mt-6 text-sm font-semibold text-slate-800">
            Send a short message with what you want to build and your timeline.
          </div>
        </div>

        <div className="card-premium p-8">
          <div className="text-base font-bold text-slate-950">Collaboration form</div>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            Share a quick overview and we’ll respond with next steps.
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
              <label className="text-sm font-bold text-slate-950">
                What do you want to collaborate on?
              </label>
              <textarea
                rows={5}
                placeholder="Describe the idea, goals, timeline, and any context..."
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400"
              />
            </div>

            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-500"
            >
              Send Partnership Request
            </button>

          </form>
        </div>
      </div>
    </Container>
  );
}
