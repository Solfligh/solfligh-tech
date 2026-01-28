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
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">{children}</div>
    </main>
  );
}
