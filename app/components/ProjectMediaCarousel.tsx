"use client";

import { useEffect, useRef, useState } from "react";

export type MediaItem =
  | {
      type: "image";
      src: string;
      alt?: string;
      /** Optional explicit thumbnail (jpg/png/webp) */
      thumb?: string;
      /** Accepts "thumbnail" from JSON data */
      thumbnail?: string;
    }
  | {
      type: "video";
      src: string;
      /** IMPORTANT: real thumbnail image (jpg/png/webp). Used for thumbnail strip + poster preview. */
      poster?: string;
      /** Optional explicit thumbnail (if you want different from poster). */
      thumb?: string;
      /** Accepts "thumbnail" from JSON data */
      thumbnail?: string;
      alt?: string;
    };

type Props = {
  items: MediaItem[];
  ariaLabel?: string;
  className?: string;
  roundedClassName?: string;
  autoPlay?: boolean; // autoplay SLIDES only (NOT video)
  intervalMs?: number;

  /** Optional: show/hide dots UI */
  showDots?: boolean;

  /**
   * Optional controlled mode:
   * If index is provided, carousel uses it as the active slide.
   * If onIndexChange is provided, carousel calls it when slide changes.
   */
  index?: number;
  onIndexChange?: (nextIndex: number) => void;
};

const FALLBACK_POSTER = "/projects/video-poster.jpg";

/**
 * ProjectMediaCarousel
 * - Slides for images/videos
 * - Video shows poster + play button (no auto-play)
 * - If video missing/unsupported -> poster-only mode (no play)
 * - IMPORTANT: video element stays hidden until it can play (prevents gray error screen)
 * - Pause video on hover
 * - Swipe support on mobile
 * - Modal uses same items and same thumbnail logic
 */
export default function ProjectMediaCarousel({
  items,
  ariaLabel = "Project media carousel",
  className = "h-48",
  roundedClassName = "rounded-2xl",
  autoPlay = true,
  intervalMs = 3500,
  showDots = true,
  index: controlledIndex,
  onIndexChange,
}: Props) {
  const safeItems = Array.isArray(items) ? items : [];

  const isControlled = typeof controlledIndex === "number";
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);

  const activeIndex = isControlled ? (controlledIndex as number) : uncontrolledIndex;

  const setIndex = (n: number) => {
    if (onIndexChange) onIndexChange(n);
    if (!isControlled) setUncontrolledIndex(n);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  // Per-slide video play state (only one can play at a time)
  const [playing, setPlaying] = useState<Record<number, boolean>>({});

  // Track broken videos (missing / unsupported mime / etc.)
  const [brokenVideo, setBrokenVideo] = useState<Record<number, boolean>>({});

  // Track which videos are actually playable (prevents gray error UI flash)
  const [videoReady, setVideoReady] = useState<Record<number, boolean>>({});

  // Refs to control videos
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  // ---------- Helpers ----------
  const clampIndex = (n: number) => {
    const len = safeItems.length;
    if (len === 0) return 0;
    return ((n % len) + len) % len;
  };

  const stopAllVideos = () => {
    setPlaying({});
    Object.values(videoRefs.current).forEach((v) => {
      try {
        v?.pause();
        if (v) v.currentTime = 0;
      } catch {}
    });
  };

  const go = (n: number) => {
    const next = clampIndex(n);
    stopAllVideos();
    setIndex(next);
  };

  const next = () => go(activeIndex + 1);
  const prev = () => go(activeIndex - 1);

  const getThumbSrc = (item: MediaItem): string => {
    if (item.type === "image") return item.thumb ?? item.thumbnail ?? item.src;

    const src = item.src;
    const fallbackPoster =
      src
        .replace(/\.mp4$/i, ".jpg")
        .replace(/\/demo\.mp4$/i, "/poster.jpg") || FALLBACK_POSTER;

    return item.thumb ?? item.thumbnail ?? item.poster ?? fallbackPoster ?? FALLBACK_POSTER;
  };

  const current = safeItems[activeIndex];

  // ---------- Autoplay slides (not video) ----------
  useEffect(() => {
    if (!autoPlay) return;
    if (safeItems.length <= 1) return;
    if (isModalOpen) return;

    const t = window.setInterval(() => {
      if (playing[activeIndex]) return;
      next();
    }, intervalMs);

    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, intervalMs, activeIndex, isModalOpen, safeItems.length, playing]);

  // Keep index valid if items change
  useEffect(() => {
    if (activeIndex >= safeItems.length) setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeItems.length]);

  // ---------- Swipe support ----------
  const swipe = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    swipe.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - s.x;
    const dy = touch.clientY - s.y;
    const dt = Date.now() - s.t;

    if (Math.abs(dx) < 40) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (dt > 1200) return;

    if (dx < 0) next();
    else prev();
  };

  // ---------- Video controls ----------
  const toggleVideo = async (i: number) => {
    const item = safeItems[i];
    if (!item || item.type !== "video") return;
    if (brokenVideo[i]) return;

    // stop other videos
    Object.keys(videoRefs.current).forEach((k) => {
      const idx = Number(k);
      if (idx !== i) {
        const v = videoRefs.current[idx];
        try {
          v?.pause();
          if (v) v.currentTime = 0;
        } catch {}
      }
    });

    const v = videoRefs.current[i];
    if (!v) return;

    const isPlaying = !!playing[i];
    if (isPlaying) {
      v.pause();
      setPlaying((p) => ({ ...p, [i]: false }));
      return;
    }

    try {
      await v.play();
      setPlaying((p) => ({ ...p, [i]: true }));
    } catch {
      setPlaying((p) => ({ ...p, [i]: false }));
    }
  };

  const pauseVideo = (i: number) => {
    if (!playing[i]) return;
    const v = videoRefs.current[i];
    try {
      v?.pause();
    } catch {}
  };

  const resumeVideo = async (i: number) => {
    if (!playing[i]) return;
    const v = videoRefs.current[i];
    if (!v) return;
    try {
      await v.play();
    } catch {}
  };

  const onVideoError = (i: number) => {
    setBrokenVideo((b) => ({ ...b, [i]: true }));
    setVideoReady((r) => ({ ...r, [i]: false }));
    setPlaying((p) => ({ ...p, [i]: false }));

    const v = videoRefs.current[i];
    try {
      v?.pause();
      if (v) v.currentTime = 0;
    } catch {}
  };

  const onVideoCanPlay = (i: number) => {
    // video is playable, safe to show the <video> layer when needed
    setVideoReady((r) => ({ ...r, [i]: true }));
  };

  // ---------- UI ----------
  if (safeItems.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${roundedClassName} ${className}`}>
        <div className="absolute inset-0 grid place-items-center text-xs font-semibold text-slate-500">
          No media
        </div>
      </div>
    );
  }

  const isVideo = current.type === "video";
  const isBroken = isVideo ? !!brokenVideo[activeIndex] : false;
  const isReady = isVideo ? !!videoReady[activeIndex] : false;

  // Only show the actual <video> layer if:
  // - not broken
  // - AND browser confirmed it can play (canplay)
  // - AND user is playing (or in modal controls where video element is needed)
  // For inline carousel: only show when playing to avoid any gray error UI.
  const showVideoLayerInline = isVideo && !isBroken && isReady && !!playing[activeIndex];

  return (
    <>
      <div
        className={`relative overflow-hidden border border-slate-200/70 bg-slate-50 shadow-sm ${roundedClassName} ${className}`}
        aria-label={ariaLabel}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slide */}
        <div className="absolute inset-0">
          {current.type === "image" ? (
            <img
              src={current.src}
              alt={current.alt ?? "Project image"}
              className="h-full w-full object-cover"
              draggable={false}
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.endsWith(FALLBACK_POSTER)) return;
                img.src = FALLBACK_POSTER;
              }}
            />
          ) : (
            <div
              className="relative h-full w-full"
              onMouseEnter={() => pauseVideo(activeIndex)}
              onMouseLeave={() => resumeVideo(activeIndex)}
            >
              {/* Poster is ALWAYS the base layer */}
              <img
                src={getThumbSrc(current)}
                alt={current.alt ?? "Project demo video poster"}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith(FALLBACK_POSTER)) return;
                  img.src = FALLBACK_POSTER;
                }}
              />

              {/* Hidden preflight video element (for canplay/error detection). Never shown directly. */}
              {!isBroken && (
                <video
                  ref={(el) => {
                    videoRefs.current[activeIndex] = el;
                  }}
                  className="hidden"
                  src={current.src}
                  preload="metadata"
                  playsInline
                  onCanPlay={() => onVideoCanPlay(activeIndex)}
                  onError={() => onVideoError(activeIndex)}
                />
              )}

              {/* Visible video layer ONLY when actually playing AND ready */}
              {showVideoLayerInline && !isBroken && (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={current.src}
                  poster={getThumbSrc(current)}
                  playsInline
                  controls={false}
                  autoPlay
                  onEnded={() => setPlaying((p) => ({ ...p, [activeIndex]: false }))}
                />
              )}

              {/* Play / Coming soon */}
              <div className="absolute inset-0 grid place-items-center">
                {isBroken ? (
                  <div className="rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                    Video coming soon
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // If it isn't ready yet, clicking will still try.
                      // If it fails, onError will flip to "coming soon".
                      toggleVideo(activeIndex);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                    aria-label={playing[activeIndex] ? "Pause video" : "Play video"}
                  >
                    <span className="text-xs">{playing[activeIndex] ? "Pause" : "Play"}</span>
                  </button>
                )}
              </div>

              {/* Badge */}
              <div className="absolute left-3 top-3 rounded-full border border-slate-200 bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
                {isBroken ? "Coming soon" : "Demo"}
              </div>
            </div>
          )}
        </div>

        {/* Arrows */}
        {safeItems.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {showDots && safeItems.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 shadow-sm backdrop-blur">
            <div className="flex items-center gap-1.5">
              {safeItems.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    go(i);
                  }}
                  className={`h-1.5 w-1.5 rounded-full transition ${
                    i === activeIndex ? "bg-sky-600" : "bg-slate-300"
                  }`}
                  aria-label={`Go to item ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Expand */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
        >
          Click to expand
        </button>
      </div>

      {/* Thumbnail strip */}
      {safeItems.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {safeItems.map((item, i) => {
            const thumb = getThumbSrc(item);
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                className={`relative h-12 w-20 flex-none overflow-hidden rounded-xl border shadow-sm transition ${
                  i === activeIndex ? "border-sky-500" : "border-slate-200"
                }`}
                aria-label={`Select media ${i + 1}`}
              >
                <img
                  src={thumb}
                  alt={item.type === "video" ? "Video thumbnail" : item.alt ?? "Image thumbnail"}
                  className="h-full w-full object-cover"
                  draggable={false}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src.endsWith(FALLBACK_POSTER)) return;
                    img.src = FALLBACK_POSTER;
                  }}
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-900 shadow-sm">
                      ▶
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <MediaModal
          items={safeItems}
          startIndex={activeIndex}
          getThumbSrc={getThumbSrc}
          onClose={() => {
            stopAllVideos();
            setModalOpen(false);
          }}
          fallbackPoster={FALLBACK_POSTER}
        />
      )}
    </>
  );
}

function MediaModal({
  items,
  startIndex,
  getThumbSrc,
  onClose,
  fallbackPoster,
}: {
  items: MediaItem[];
  startIndex: number;
  getThumbSrc: (item: MediaItem) => string;
  onClose: () => void;
  fallbackPoster: string;
}) {
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState<Record<number, boolean>>({});
  const [brokenVideo, setBrokenVideo] = useState<Record<number, boolean>>({});
  const [videoReady, setVideoReady] = useState<Record<number, boolean>>({});
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const clamp = (n: number) => {
    const len = items.length;
    if (len === 0) return 0;
    return ((n % len) + len) % len;
  };

  const stopAll = () => {
    setPlaying({});
    Object.values(videoRefs.current).forEach((v) => {
      try {
        v?.pause();
        if (v) v.currentTime = 0;
      } catch {}
    });
  };

  const go = (n: number) => {
    stopAll();
    setIndex(clamp(n));
  };

  const onVideoError = (i: number) => {
    setBrokenVideo((b) => ({ ...b, [i]: true }));
    setVideoReady((r) => ({ ...r, [i]: false }));
    setPlaying((p) => ({ ...p, [i]: false }));

    const v = videoRefs.current[i];
    try {
      v?.pause();
      if (v) v.currentTime = 0;
    } catch {}
  };

  const onVideoCanPlay = (i: number) => {
    setVideoReady((r) => ({ ...r, [i]: true }));
  };

  const toggleVideo = async (i: number) => {
    const item = items[i];
    if (!item || item.type !== "video") return;
    if (brokenVideo[i]) return;

    const v = videoRefs.current[i];
    if (!v) return;

    const isPlaying = !!playing[i];
    if (isPlaying) {
      v.pause();
      setPlaying((p) => ({ ...p, [i]: false }));
      return;
    }

    try {
      await v.play();
      setPlaying((p) => ({ ...p, [i]: true }));
    } catch {
      setPlaying((p) => ({ ...p, [i]: false }));
    }
  };

  // ESC + arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const current = items[index];
  const isVideo = current.type === "video";
  const isBroken = isVideo ? !!brokenVideo[index] : false;
  const isReady = isVideo ? !!videoReady[index] : false;

  // In modal: we ONLY show the visible video player when:
  // - not broken
  // - and ready
  // - and user has started playing
  const showVideoLayerModal = isVideo && !isBroken && isReady && !!playing[index];

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">Media</div>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="relative bg-slate-950">
            <div className="relative aspect-[16/9] w-full">
              {current.type === "image" ? (
                <img
                  src={current.src}
                  alt={current.alt ?? "Project image"}
                  className="h-full w-full object-contain"
                  draggable={false}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src.endsWith(fallbackPoster)) return;
                    img.src = fallbackPoster;
                  }}
                />
              ) : (
                <div className="relative h-full w-full">
                  {/* Poster is ALWAYS the base layer */}
                  <img
                    src={getThumbSrc(current)}
                    alt={current.alt ?? "Project demo poster"}
                    className="absolute inset-0 h-full w-full object-contain"
                    draggable={false}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src.endsWith(fallbackPoster)) return;
                      img.src = fallbackPoster;
                    }}
                  />

                  {/* Hidden preflight video element for canplay/error detection */}
                  {!isBroken && (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      className="hidden"
                      src={current.src}
                      preload="metadata"
                      playsInline
                      onCanPlay={() => onVideoCanPlay(index)}
                      onError={() => onVideoError(index)}
                    />
                  )}

                  {/* Visible video player ONLY when playing AND ready */}
                  {showVideoLayerModal && !isBroken && (
                    <video
                      className="absolute inset-0 h-full w-full object-contain"
                      src={current.src}
                      playsInline
                      controls
                      autoPlay
                      onPlay={() => setPlaying((p) => ({ ...p, [index]: true }))}
                      onPause={() => setPlaying((p) => ({ ...p, [index]: false }))}
                      onEnded={() => setPlaying((p) => ({ ...p, [index]: false }))}
                    />
                  )}

                  {/* Overlay */}
                  {!playing[index] && (
                    <div className="absolute inset-0 grid place-items-center">
                      {isBroken ? (
                        <div className="rounded-full border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
                          Video coming soon
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleVideo(index)}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
                        >
                          Play
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-xl font-bold text-white hover:bg-white/20"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-xl font-bold text-white hover:bg-white/20"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {items.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-slate-900 px-3 py-3">
                {items.map((item, i) => {
                  const thumb = getThumbSrc(item);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => go(i)}
                      className={`relative h-14 w-24 flex-none overflow-hidden rounded-xl border transition ${
                        i === index ? "border-sky-400" : "border-white/10"
                      }`}
                    >
                      <img
                        src={thumb}
                        alt={item.type === "video" ? "Video thumbnail" : item.alt ?? "Image thumbnail"}
                        className="h-full w-full object-cover"
                        draggable={false}
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src.endsWith(fallbackPoster)) return;
                          img.src = fallbackPoster;
                        }}
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-900">
                            ▶
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
