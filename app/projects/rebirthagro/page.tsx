// app/projects/rebirthagro/page.tsx
import ProjectDetailPage from "../[slug]/page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RebirthAgroPage() {
  return <ProjectDetailPage params={{ slug: "rebirthagro" }} />;
}
