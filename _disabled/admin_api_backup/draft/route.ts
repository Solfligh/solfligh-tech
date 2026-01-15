import { NextResponse } from "next/server";

export const runtime = "nodejs";

function requireAdmin(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  const expected = process.env.ADMIN_TOKEN || "";
  if (!expected) return { ok: false as const, error: "ADMIN_TOKEN is not set on the server." };
  if (!token || token !== expected) return { ok: false as const, error: "Invalid admin token." };
  return { ok: true as const };
}

function pickLines(text: string, max = 6) {
  const lines = String(text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return lines.slice(0, max);
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const answers = body.answers || {};

  const targetUsers = String(answers.targetUsers || "").trim();
  const coreProblem = String(answers.coreProblem || "").trim();
  const currentWorkflow = String(answers.currentWorkflow || "").trim();
  const howItWorks = String(answers.howItWorks || "").trim();
  const magic = String(answers.magic || "").trim();
  const differentiator = String(answers.differentiator || "").trim();
  const platforms = String(answers.platforms || "").trim();
  const tech = String(answers.tech || "").trim();

  const shortDescription =
    description ||
    `${name} is a ${platforms ? platforms.toLowerCase() : "modern"} platform for ${
      targetUsers || "teams"
    } — built to ${
      coreProblem ? coreProblem.toLowerCase() : "solve real operational problems with clarity and speed"
    }.`;

  const problem =
    coreProblem
      ? `${targetUsers ? `${targetUsers} ` : "Teams "}often struggle with ${coreProblem.toLowerCase()}.${
          currentWorkflow ? ` Today, it’s commonly handled using ${currentWorkflow.trim()}.` : ""
        }`
      : `Many teams waste time switching between tools, manual tracking, and inconsistent workflows — causing delays, missed opportunities, and poor visibility.`;

  const solution =
    `${name} brings the workflow into one clean place: ` +
    `${howItWorks ? howItWorks.trim() : "capture the key steps, track progress, and keep everything organized in a single dashboard."}` +
    `${magic ? ` The “wow” is ${magic.trim()}.` : ""}` +
    `${differentiator ? ` Compared to alternatives, it stands out by ${differentiator.trim()}.` : ""}`;

  const keyFeatures = [
    magic ? magic : "Clean dashboard for day-to-day execution",
    "Structured workflow that reduces manual work",
    "Fast navigation and clear UI for teams",
    "Exportable data & reporting-ready views",
    "Scales from solo to multi-user teams",
  ]
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 6);

  const roadmap = ["Finalize core flows and polish UX", "Complete demo media + walkthrough", "Public demo release"];

  const techStack =
    tech
      ? tech
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
          .slice(0, 10)
      : ["Next.js", "Tailwind", "APIs"];

  const highlights = pickLines(body.highlightsText || "", 6);
  const fallbackHighlights = ["Premium, clean UX", "Built for real workflows", "Scalable architecture"];

  return NextResponse.json({
    shortDescription,
    problem,
    solution,
    keyFeatures,
    roadmap,
    techStack,
    highlights: highlights.length ? highlights : fallbackHighlights,
  });
}
