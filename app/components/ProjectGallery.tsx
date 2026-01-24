"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import ProjectMediaCarousel, { type MediaItem } from "@/app/components/ProjectMediaCarousel";

const FALLBACK_POSTER = "/projects/video-poster.jpg";

/** Ensure local asset paths start with "/" so they don't become relative like /projects/rebirthagro/projects/... */
function normalizeSrc(src: string | undefined | null): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

/** Only treat as real video if it looks like a video file */
function isLikelyVideoSrc(src: string | undefined | null): boolean {
  const s = normalizeSrc(src);
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(s);
}

/**
 * ✅ Sanitize items:
 * - Keep images
 * - Keep videos ONLY if src is a real-looking video file
 * - If there is NO real video, we do NOT include a fake video slide (so no Play UI can show)
 */
function sanitizeItems(title: string, items: MediaItem[]): { items: MediaItem[]; hasRealVideo: boolean } {
  const out: MediaItem[] = [];
  let hasRealVideo = false;

  for (const m of items) {
    if (!m) continue;

    if (m.type === "video") {
      // ✅ Keep only real videos
      if (!isLikelyVideoSrc(m.src)) continue;

      hasRealVideo = true;
      out.push({
        ...m,
        src: normalizeSrc(m.src),
        poster: normalizeSrc(m.poster),
        thumb: normalizeSrc(m.thumb),
        thumbnail: normalizeSrc(m.thumbnail),
        alt: m.alt ?? `${title} demo video`,
      });
      continue;
    }

    // image
    out.push({
      ...m,
      src: normalizeSrc(m.src) || FALLBACK_POSTER,
      thumb: normalizeSrc(m.thumb),
      thumbnail: normalizeSrc(m.thumbnail),
      alt: m.alt ?? `${title} image`,
    });
  }

  // If everything was filtered out, fallback to an IMAGE (not video)
  if (out.length === 0) {
    return {
      items: [
        {
          type: "image",
          src: FALLBACK_POSTER,
          alt: "Media coming soon",
        },
      ],
      hasRealVideo: false,
    };
  }

  return { items: out, hasRealVideo };
}

export default function ProjectGallery({
  title,
  items,
}: {
  title: string;
  items: MediaItem[];
}) {
  const { items: safeItems, hasRealVideo } = useMemo(
    () => sanitizeItems(title, Array.isArray(items) ? items : []),
    [items, title]
  );

  const [open, setOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const count = safeItems.length;

  useEffect(() => {
    if (open) setModalIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        (e.target as HTMLElement | null)?.isContentEditable
      )
        return;

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (count > 1 && e.key === "ArrowLeft") {
        e.preventDefault();
        setModalIndex((i) => (i - 1 + count) % count);
        return;
      }

      if (count > 1 && e.key === "ArrowRight") {
        e.preventDefault();
        setModalIndex((i) => (i + 1) % count);
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, count]);

  const close = () => setOpen(false);
  const openModal = () => setOpen(true);

  const onInlineKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <>
      {/* Inline gallery */}
      <div
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={onInlineKeyDown}
        aria-label={`Open ${title} gallery`}
        className="block w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500/30"
      >
        <div className="relative">
          <ProjectMediaCarousel
            items={safeItems}
            ariaLabel={`${title} media`}
            className="h-[260px] sm:h-[380px]"
            roundedClassName="rounded-none"
            showDots
          />

          {/* ✅ If NO real video exists, show “Demo video coming soon” */}
          {!hasRealVideo && (
            <div className="pointer-events-none absolute left-4 bottom-4 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
              🎥 Demo video coming soon
            </div>
          )}

          <div className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
            Click to expand
          </div>
        </div>
      </div>

      {/* Modal */}
      {open ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery modal`}
          onMouseDown={close}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/30 bg-white shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
              <div>
                <p className="text-xs font-semibold text-slate-500">Gallery</p>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              </div>

              <button
                type="button"
                onClick={close}
                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                aria-label="Close"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-50">
              <ProjectMediaCarousel
                items={safeItems}
                ariaLabel={`${title} fullscreen media`}
                className="h-[55vh] sm:h-[65vh]"
                roundedClassName="rounded-none"
                showDots={false}
                autoPlay={false}
                index={modalIndex}
                onIndexChange={setModalIndex}
              />

              {/* ✅ In modal too */}
              {!hasRealVideo && (
                <div className="px-5 pb-4 pt-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    🎥 Demo video coming soon
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="border-t border-slate-200/70 bg-white px-4 py-3">
              <div className="flex gap-3 overflow-x-auto pb-1">
                {safeItems.map((m, i) => {
                  const selected = i === modalIndex;

                  // ✅ Supports thumb / thumbnail / poster
                  const thumbSrc =
                    m.type === "image"
                      ? normalizeSrc(m.thumb ?? m.thumbnail ?? m.src)
                      : normalizeSrc(m.thumb ?? m.thumbnail ?? m.poster ?? "");

                  return (
                    <button
                      key={`${m.src}-${i}`}
                      type="button"
                      onClick={() => setModalIndex(i)}
                      className={[
                        "relative flex h-16 w-24 flex-none overflow-hidden rounded-xl border transition",
                        selected
                          ? "border-sky-500 ring-2 ring-sky-200"
                          : "border-slate-200 hover:border-slate-300",
                        "bg-slate-100",
                      ].join(" ")}
                      aria-label={`Open slide ${i + 1}`}
                    >
                      {thumbSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbSrc}
                          alt={m.alt ?? `${title} thumbnail ${i + 1}`}
                          className="h-full w-full object-cover"
                          draggable={false}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_POSTER;
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800">
                            Media
                          </div>
                        </div>
                      )}

                      {m.type === "video" ? (
                        <div className="absolute bottom-2 right-2 rounded-full border border-slate-200/70 bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          ▶
                        </div>
                      ) : null}

                      {selected ? <div className="absolute inset-0 bg-sky-500/10" /> : null}
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-slate-600">
                Tip: Swipe on mobile • Use on-screen arrows • Use keyboard ← / → • Press ESC to close
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
