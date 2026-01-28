import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights | SolFligh Tech",
  description:
    "Practical, plain-language articles about building clearer software for real-world business problems.",
};

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Premium background */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(59,130,246,0.10),_transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
          {children}
        </div>
      </div>
    </main>
  );
}
