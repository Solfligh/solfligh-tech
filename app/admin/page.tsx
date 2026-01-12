"use client";

import { useMemo, useState } from "react";
import Container from "@/app/components/Container";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import ProjectMediaCarousel, { type MediaItem } from "@/app/components/ProjectMediaCarousel";
import ProjectGallery from "@/app/components/ProjectGallery";

type ProjectPayload = {
  slug: string;
  name: string;
  status: string;
  statusColor: string;
  description: string;
  highlights: string[];
  ctaLabel: string;
  href: string;
  published: boolean;
  media: MediaItem[];

  // ✅ NEW long-form fields
  problem: string;
  solution: string;
  keyFeatures: string[];
  roadmap: string[];
  techStack: string[];
};

type DraftAnswers = {
  targetUsers: string;
  coreProblem: string;
  currentWorkflow: string;
  magic: string;
  howItWorks: string;
  differentiator: string;
  status: "Live / Near Launch" | "In Development" | "Upcoming";
  platforms: string; // web / mobile / both
  tech: string; // free text
};

const STATUS_PRESETS: Record<ProjectPayload["status"], { color: string; cta: string }> = {
  "Live / Near Launch": {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cta: "View project",
  },
  "In Development": {
    color: "bg-sky-100 text-sky-700 border-sky-200",
    cta: "Get updates",
  },
  Upcoming: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    cta: "Preview concept",
  },
};

function clampLines(input: string) {
  return input
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState("");

  // Core
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ProjectPayload["status"]>("Upcoming");
  const [description, setDescription] = useState("");
  const [highlightsText, setHighlightsText] = useState("Feature one\nFeature two\nFeature three");

  // Media (paths)
  const [mediaText, setMediaText] = useState(
    "/projects/your-slug/demo.mp4\n/projects/your-slug/1.jpg\n/projects/your-slug/2.jpg"
  );

  // New long-form fields
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [keyFeaturesText, setKeyFeaturesText] = useState("");
  const [roadmapText, setRoadmapText] = useState("");
  const [techStackText, setTechStackText] = useState("");

  const [published, setPublished] = useState(true);

  // Draft assistant answers
  const [answers, setAnswers] = useState<DraftAnswers>({
    targetUsers: "",
    coreProblem: "",
    currentWorkflow: "",
    magic: "",
    howItWorks: "",
    differentiator: "",
    status: "Upcoming",
    platforms: "Web",
    tech: "Next.js, Tailwind, APIs",
  });

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const statusPreset = STATUS_PRESETS[status];

  const parsedMedia: MediaItem[] = useMemo(() => {
    const lines = clampLines(mediaText);
    return lines.map((src) => {
      const lower = src.toLowerCase();
      const isVideo = lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov");
      if (isVideo) return { type: "video", src };
      return { type: "image", src, alt: `${name || slug} media` };
    });
  }, [mediaText, name, slug]);

  const payload: ProjectPayload = useMemo(() => {
    const finalStatus = status;
    const preset = STATUS_PRESETS[finalStatus];

    const safeSlug = slug.trim().toLowerCase();
    const href = `/projects/${safeSlug}`;

    return {
      slug: safeSlug,
      name: name.trim(),
      status: finalStatus,
      statusColor: preset.color,
      description: description.trim(),
      highlights: clampLines(highlightsText),
      ctaLabel: preset.cta,
      href,
      published,
      media: parsedMedia,

      problem: problem.trim(),
      solution: solution.trim(),
      keyFeatures: clampLines(keyFeaturesText),
      roadmap: clampLines(roadmapText),
      techStack: clampLines(techStackText),
    };
  }, [
    slug,
    name,
    status,
    description,
    highlightsText,
    published,
    parsedMedia,
    problem,
    solution,
    keyFeaturesText,
    roadmapText,
    techStackText,
  ]);

  async function generateDraft() {
    setToast(null);

    if (!slug.trim() || !name.trim()) {
      setToast({ type: "err", msg: "Add slug + name first." });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/admin/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify({
          slug: slug.trim(),
          name: name.trim(),
          description: description.trim(),
          answers: {
            ...answers,
            status,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Draft generation failed");
      }

      // Apply generated fields
      setProblem(data.problem || "");
      setSolution(data.solution || "");
      setKeyFeaturesText((data.keyFeatures || []).join("\n"));
      setRoadmapText((data.roadmap || []).join("\n"));
      setTechStackText((data.techStack || []).join("\n"));

      // If description is empty, fill it
      if (!description.trim() && data.shortDescription) {
        setDescription(data.shortDescription);
      }

      // If highlights empty-ish, fill it
      const hl = clampLines(highlightsText);
      if (hl.length <= 1 && (data.highlights?.length || 0) > 0) {
        setHighlightsText(data.highlights.join("\n"));
      }

      setToast({ type: "ok", msg: "Draft generated. Open Preview to review, then Publish." });
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Draft generation failed" });
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveProject() {
    setToast(null);

    // Basic validation
    if (!adminToken.trim()) {
      setToast({ type: "err", msg: "Paste your ADMIN_TOKEN first." });
      return;
    }
    if (!payload.slug || !payload.name) {
      setToast({ type: "err", msg: "Slug and Name are required." });
      return;
    }
    if (!payload.description) {
      setToast({ type: "err", msg: "Add a short description (or use Generate)." });
      return;
    }
    if (!payload.media.length) {
      setToast({ type: "err", msg: "Add at least 1 media file path (video or image)." });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": adminToken },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");

      setToast({ type: "ok", msg: "Saved. (If published=true, it will show on /projects)" });
    } catch (e: any) {
      setToast({ type: "err", msg: e?.message || "Save failed" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="bg-white text-slate-900">
      <section className="py-12 sm:py-16">
        <Container>
          <PageHeader
            level={1}
            badge="Admin"
            title="Project Publisher"
            subtitle="Answer a few questions → generate a clean write-up → preview → publish."
            actions={
              <div className="flex items-center gap-3">
                <Link
                  href="/maintenance"
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  View maintenance
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                >
                  View projects
                </Link>
              </div>
            }
          />

          {toast && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                toast.type === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {toast.msg}
            </div>
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h2 className="text-sm font-semibold text-slate-900">Admin Token</h2>
                <p className="mt-1 text-xs text-slate-600">
                  This must match your <code className="font-semibold">ADMIN_TOKEN</code> in Vercel env.
                </p>
                <input
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  placeholder="Paste ADMIN_TOKEN here"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                />
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h2 className="text-sm font-semibold text-slate-900">Project Basics</h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Slug (e.g. profitpilot)</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Name</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Status</label>
                    <select
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                    >
                      <option>Upcoming</option>
                      <option>In Development</option>
                      <option>Live / Near Launch</option>
                    </select>
                  </div>

                  <div className="flex items-end gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                      />
                      <span className="text-sm font-semibold text-slate-900">Published</span>
                    </label>
                    <span className="text-xs text-slate-500">(turn off to save as draft)</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700">Short description</label>
                  <textarea
                    className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A modern platform that…"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700">Highlights (one per line)</label>
                  <textarea
                    className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                    value={highlightsText}
                    onChange={(e) => setHighlightsText(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700">
                    Media file paths (one per line) — first line should be the demo video
                  </label>
                  <p className="mt-1 text-xs text-slate-600">
                    Example: <code>/projects/profitpilot/demo.mp4</code>, <code>/projects/profitpilot/1.jpg</code>
                  </p>
                  <textarea
                    className="mt-2 w-full min-h-[110px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                    value={mediaText}
                    onChange={(e) => setMediaText(e.target.value)}
                  />
                </div>
              </div>

              {/* ✅ Draft Assistant */}
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">AI Assistant (Q&A)</h2>
                    <p className="mt-1 text-xs text-slate-600">
                      Answer these. Then click Generate to auto-fill Problem/Solution/etc.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={generateDraft}
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
                  >
                    {isGenerating ? "Generating…" : "Generate (AI)"}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Who is it for?</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.targetUsers}
                      onChange={(e) => setAnswers((p) => ({ ...p, targetUsers: e.target.value }))}
                      placeholder="SMEs, traders, farmers, logistics…"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Platform</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.platforms}
                      onChange={(e) => setAnswers((p) => ({ ...p, platforms: e.target.value }))}
                      placeholder="Web / Mobile / Both"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">
                      What problem does it solve (in one sentence)?
                    </label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.coreProblem}
                      onChange={(e) => setAnswers((p) => ({ ...p, coreProblem: e.target.value }))}
                      placeholder="People struggle to…"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">
                      How do they do it today (current workflow)?
                    </label>
                    <textarea
                      className="mt-2 w-full min-h-[90px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.currentWorkflow}
                      onChange={(e) => setAnswers((p) => ({ ...p, currentWorkflow: e.target.value }))}
                      placeholder="Spreadsheets, WhatsApp, multiple tools…"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Describe how it works (simple steps)
                    </label>
                    <textarea
                      className="mt-2 w-full min-h-[90px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.howItWorks}
                      onChange={(e) => setAnswers((p) => ({ ...p, howItWorks: e.target.value }))}
                      placeholder="User signs in → creates… → tracks… → exports…"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">What’s the “magic” / wow?</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.magic}
                      onChange={(e) => setAnswers((p) => ({ ...p, magic: e.target.value }))}
                      placeholder="AI insights, automation, one dashboard…"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">What makes it different?</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.differentiator}
                      onChange={(e) => setAnswers((p) => ({ ...p, differentiator: e.target.value }))}
                      placeholder="Banking-grade UX, local-first…"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700">Tech (free text)</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={answers.tech}
                      onChange={(e) => setAnswers((p) => ({ ...p, tech: e.target.value }))}
                      placeholder="Next.js, Tailwind, Supabase…"
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Generated sections */}
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h2 className="text-sm font-semibold text-slate-900">Generated write-up (editable)</h2>
                <p className="mt-1 text-xs text-slate-600">
                  You can edit after generation. Preview before you publish.
                </p>

                <div className="mt-5 grid gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Problem</label>
                    <textarea
                      className="mt-2 w-full min-h-[90px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Solution</label>
                    <textarea
                      className="mt-2 w-full min-h-[90px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-700">Key features (one per line)</label>
                      <textarea
                        className="mt-2 w-full min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                        value={keyFeaturesText}
                        onChange={(e) => setKeyFeaturesText(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-700">Roadmap (one per line)</label>
                      <textarea
                        className="mt-2 w-full min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                        value={roadmapText}
                        onChange={(e) => setRoadmapText(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-700">Tech stack (one per line)</label>
                      <textarea
                        className="mt-2 w-full min-h-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                        value={techStackText}
                        onChange={(e) => setTechStackText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                  >
                    Preview (before publish)
                  </button>

                  <button
                    type="button"
                    onClick={saveProject}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : published ? "Publish project" : "Save draft"}
                  </button>

                  <span className="text-xs text-slate-500">
                    Tip: keep Published off until your preview looks perfect.
                  </span>
                </div>
              </div>
            </div>

            {/* Right: live small preview card */}
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h3 className="text-sm font-semibold text-slate-900">Live card preview</h3>
                <p className="mt-1 text-xs text-slate-600">This is how it will look on /projects.</p>

                <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <ProjectMediaCarousel
                    items={parsedMedia.length ? parsedMedia : [{ type: "image", src: "/images/placeholder.png", alt: "placeholder" }]}
                    ariaLabel="Preview media"
                    autoPlay
                    intervalMs={3500}
                    className="h-44"
                    roundedClassName="rounded-t-3xl"
                  />

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-base font-semibold text-slate-900">{payload.name || "Project name"}</div>
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusPreset.color}`}
                      >
                        {status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {payload.description || "Short description will show here…"}
                    </p>

                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {(payload.highlights.length ? payload.highlights : ["Feature 1", "Feature 2", "Feature 3"]).map((x) => (
                        <li key={x} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <span>{x}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                      >
                        Open preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h3 className="text-sm font-semibold text-slate-900">Notes</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Put your demo video first in the media list.</li>
                  <li>• Use .jpg/.png images for screenshots.</li>
                  <li>• Preview before Publish to avoid broken pages.</li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* ✅ Full Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="text-sm font-semibold text-slate-900">Preview: {payload.name || payload.slug}</div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto p-6">
              {/* This mimics your project detail page layout */}
              <div className="mb-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  ← Back to projects
                </Link>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700">
                    Project
                  </div>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {payload.name || "Project name"}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                    {payload.description || "Short description will show here…"}
                  </p>
                </div>

                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${payload.statusColor}`}>
                  {payload.status}
                </span>
              </div>

              <div className="mt-8">
                <ProjectGallery title={payload.name || payload.slug} items={payload.media} />
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur lg:col-span-2">
                  <h2 className="text-lg font-semibold text-slate-900">Problem</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {payload.problem || "Click Generate (AI) or write the Problem here."}
                  </p>

                  <h2 className="mt-6 text-lg font-semibold text-slate-900">Solution</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {payload.solution || "Click Generate (AI) or write the Solution here."}
                  </p>

                  <h2 className="mt-6 text-lg font-semibold text-slate-900">Key features</h2>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {(payload.keyFeatures.length ? payload.keyFeatures : ["Feature one", "Feature two", "Feature three"]).map(
                      (x) => (
                        <li key={x} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
                          <span>{x}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                  <h3 className="text-sm font-semibold text-slate-900">Roadmap</h3>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {(payload.roadmap.length ? payload.roadmap : ["Finalize core flows", "Ship public demo"]).map((x) => (
                      <li key={x} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-6 text-sm font-semibold text-slate-900">Tech stack</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(payload.techStack.length ? payload.techStack : ["Next.js", "Tailwind", "APIs"]).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                      onClick={saveProject}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving…" : published ? "Publish now" : "Save draft"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                      onClick={() => setPreviewOpen(false)}
                    >
                      Keep editing
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <h3 className="text-sm font-semibold text-slate-900">Card highlights</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {(payload.highlights.length ? payload.highlights : ["Feature 1", "Feature 2"]).map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-600" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 text-xs text-slate-500">
                Preview only — nothing is published until you click Publish/Save.
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
