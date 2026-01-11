"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string; // e.g. "/projects/profitfx/demo-poster.jpg"
};

export default function ProjectMediaCarousel({
  items,
  ariaLabel,
  autoPlay = true,
  intervalMs = 3500,
  className = "h-48",
  roundedClassName = "rounded-t-3xl",
  showDots = true,

  index: controlledIndex,
  onIndexChange,
}: {
  items: MediaItem[];
  ariaLabel: string;
  autoPlay?: boolean;
  intervalMs?: number;
  className?: string;
  roundedClassName?: string;
  showDots?: boolean;

  index?: number;
  onIndexChange?: (i: number) => void;
}) {
  const safeItems = useMemo(() => items.filter(Boolean), [items]);

  const [internalIndex, setInternalIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // ✅ whether our <img> poster overlay should be shown (Chrome-proof)
  const [showPosterOverlay, setShowPosterOverlay] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  const count = safeItems.length;

  const index =
    typeof controlledIndex === "number"
      ? Math.max(0, Math.min(controlledIndex, Math.max(0, count - 1)))
      : internalIndex;

  const current = safeItems[index];

  useEffect(() => {
    if (typeof controlledIndex === "number") {
      setInternalIndex(controlledIndex);
    }
  }, [controlledIndex]);

  const setIndex = (next: number) => {
    const clamped = count <= 0 ? 0 : ((next % count) + count) % count;
    setInternalIndex(clamped);
    onIndexChange?.(clamped);
  };

  // On slide change: stop video, show poster overlay again
  useEffect(() => {
    setIsVideoPlaying(false);
    setShowPosterOverlay(true);

    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
      } catch {}
    }
  }, [index]);

  // Autoplay slideshow (paused on hover or while video is playing)
  useEffect(() => {
    if (!autoPlay) return;
    if (count <= 1) return;
    if (isHovering) return;
    if (isVideoPlaying) return;

    const t = window.setInterval(() => {
      setIndex(index + 1);
    }, intervalMs);

    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, intervalMs, count, isHovering, isVideoPlaying, index]);

  // Clamp if items change
  useEffect(() => {
    if (count <= 0) return;
    if (index >= count) setIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const goPrev = (e?: React.SyntheticEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (count <= 1) return;
    setIndex(index - 1);
  };

  const goNext = (e?: React.SyntheticEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (count <= 1) return;
    setIndex(index + 1);
  };

  const goTo = (e: React.SyntheticEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex(i);
  };

  // Swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const sx = touchStartX.current;
    const sy = touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (sx == null || sy == null) return;
    if (e.changedTouches.length !== 1) return;

    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;

    if (Math.abs(dx) < 45) return;
    if (Math.abs(dy) > 60) return;

    if (dx < 0) goNext(e);
    else goPrev(e);
  };

  const onPlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play()
        .then(() => {
          setIsVideoPlaying(true);
          setShowPosterOverlay(false); // ✅ hide poster overlay once playing
        })
        .catch(() => {});
    } else {
      v.pause();
      setIsVideoPlaying(false);
      setShowPosterOverlay(true);
    }
  };

  if (count === 0) {
    return (
      <div
        className={`relative w-full ${className} ${roundedClassName} border-b border-slate-200/70 bg-slate-100`}
      />
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className} ${roundedClassName} border-b border-slate-200/70 bg-slate-100`}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {current.type === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.src}
          alt={current.alt ?? ariaLabel}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="relative h-full w-full">
          {/* Video element */}
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={current.src}
            poster={current.poster}
            muted
            playsInline
            preload="metadata"
            onPlay={() => {
              setIsVideoPlaying(true);
              setShowPosterOverlay(false);
            }}
            onPause={() => {
              setIsVideoPlaying(false);
              setShowPosterOverlay(true);
            }}
            onEnded={() => {
              setIsVideoPlaying(false);
              setShowPosterOverlay(true);
            }}
          />

          {/* ✅ Poster overlay image (fixes Chrome blank poster in modal) */}
          {current.poster && showPosterOverlay ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.poster}
              alt={current.alt ?? `${ariaLabel} video poster`}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          ) : null}

          <button
            onClick={onPlayClick}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={isVideoPlaying ? "Pause video" : "Play video"}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                {isVideoPlaying ? (
                  <path
                    d="M8 6v12M16 6v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M10 8l8 4-8 4V8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
              {isVideoPlaying ? "Pause" : "Play"}
            </span>
          </button>

          <div className="absolute left-3 top-3 rounded-full border border-slate-200/70 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
            Demo
          </div>
        </div>
      )}

      {count > 1 ? (
        <>
          <button
            onClick={(e) => goPrev(e)}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/70 bg-white/75 p-2 text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={(e) => goNext(e)}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-slate-200/70 bg-white/75 p-2 text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {showDots ? (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full border border-slate-200/70 bg-white/70 px-2.5 py-1.5 shadow-sm backdrop-blur">
              {safeItems.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => goTo(e, i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={[
                    "h-1.5 w-1.5 rounded-full transition",
                    i === index ? "bg-sky-600" : "bg-slate-300 hover:bg-slate-400",
                  ].join(" ")}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
