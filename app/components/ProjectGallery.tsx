"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectMediaCarousel, { type MediaItem } from "@/app/components/ProjectMediaCarousel";

export default function ProjectGallery({
  title,
  items,
}: {
  title: string;
  items: MediaItem[];
}) {
  const safeItems = useMemo(() => items.filter(Boolean), [items]);
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
            </div>

            {/* Thumbnail strip (real video thumbnails via poster) */}
            <div className="border-t border-slate-200/70 bg-white px-4 py-3">
              <div className="flex gap-3 overflow-x-auto pb-1">
                {safeItems.map((m, i) => {
                  const selected = i === modalIndex;

                  const thumbSrc =
                    m.type === "image"
                      ? m.src
                      : m.poster || ""; // ✅ use video poster if present

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
                        />
                      ) : (
                        // fallback if no poster provided
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M10 8l8 4-8 4V8z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                            </svg>
                            Video
                          </div>
                        </div>
                      )}

                      {/* video badge */}
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
