"use client";

import { useMemo, useState } from "react";

type ProjectForm = {
  slug: string;
  name: string;
  status: string;
  description: string;
  highlights: string;
  cta_label: string;
  is_published: boolean;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [project, setProject] = useState<ProjectForm>({
    slug: "",
    name: "",
    status: "Upcoming",
    description: "",
    highlights: "Feature one\nFeature two\nFeature three",
    cta_label: "View project",
    is_published: true,
  });

  const [createdSlug, setCreatedSlug] = useState<string>("");
  const [msg, setMsg] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-token": token,
    }),
    [token]
  );

  async function createProject() {
    setMsg("");
    const highlights = project.highlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...project,
        slug: project.slug.trim().toLowerCase(),
        highlights,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      setMsg(json?.error || "Failed");
      return;
    }
    setCreatedSlug(json.data.slug);
    setMsg(`✅ Project saved: ${json.data.slug}`);
  }

  async function uploadMedia(file: File, type: "image" | "video") {
    if (!createdSlug) {
      setMsg("Create the project first.");
      return;
    }
    setUploading(true);
    setMsg("");

    const form = new FormData();
    form.append("file", file);
    form.append("projectSlug", createdSlug);
    form.append("type", type);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-token": token },
      body: form,
    });

    const json = await res.json();
    setUploading(false);

    if (!res.ok) {
      setMsg(json?.error || "Upload failed");
      return;
    }

    // Save media record
    const mediaRes = await fetch("/api/admin/media", {
      method: "POST",
      headers,
      body: JSON.stringify({
        slug: createdSlug,
        type,
        src: json.url,
      }),
    });

    const mediaJson = await mediaRes.json();
    if (!mediaRes.ok) {
      setMsg(mediaJson?.error || "Media save failed");
      return;
    }

    setMsg("✅ Media uploaded + attached.");
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold">Admin — Projects</h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload project images/videos and publish projects without touching code.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <label className="text-sm font-semibold">Admin Token</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste ADMIN_TOKEN here"
          />
          <p className="mt-2 text-xs text-slate-500">
            (This is the ADMIN_TOKEN env var you set in Vercel)
          </p>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-slate-200 p-5">
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Slug (e.g. profitpilot)</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={project.slug}
              onChange={(e) => setProject({ ...project, slug: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Name</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Status</label>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={project.status}
              onChange={(e) => setProject({ ...project, status: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold">Highlights (one per line)</label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={project.highlights}
              onChange={(e) => setProject({ ...project, highlights: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="pub"
              type="checkbox"
              checked={project.is_published}
              onChange={(e) => setProject({ ...project, is_published: e.target.checked })}
            />
            <label htmlFor="pub" className="text-sm font-semibold">
              Published
            </label>
          </div>

          <button
            onClick={createProject}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
          >
            Save Project
          </button>

          <div className="text-sm text-slate-700">
            Current project:{" "}
            <span className="font-semibold">{createdSlug ? createdSlug : "—"}</span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-bold">Upload Media</h2>
          <p className="mt-1 text-xs text-slate-500">
            Upload an image or demo video. Add video first if you want it to be slide #1.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold">Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadMedia(f, "image");
                }}
                disabled={uploading}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadMedia(f, "video");
                }}
                disabled={uploading}
              />
            </label>
          </div>

          {uploading ? <p className="mt-3 text-sm">Uploading…</p> : null}
        </div>

        {msg ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-4 text-sm">
            {msg}
          </div>
        ) : null}
      </div>
    </main>
  );
}
