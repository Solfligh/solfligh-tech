// app/projects/profitpilot/page.tsx
import ProjectDetailPage from "../[slug]/page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfitPilotPage() {
  return <ProjectDetailPage params={{ slug: "profitpilot" }} />;
}
