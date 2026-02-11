"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  title: string;
  subtitle?: string;
  accentClass: string; // tailwind gradient
  bullets?: string[];
  paragraphs: string[];
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ReadingSlider() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "Why most trading tools don’t stop the real damage",
        subtitle: "The loss usually happens before the trade in the decision.",
        accentClass: "from-emerald-500/20 via-white to-sky-500/15",
        bullets: [
          "Charts give information, not discipline",
          "Signals give entries, not understanding",
          "Journals help after the damage is done",
          "Indicators explain price, not decision quality",
        ],
        paragraphs: [
          "Most losses don’t come from not knowing how to trade. They come from breaking your own rules.",
          "Over-leveraging after a loss. Entering without confirmation because price is “about to move.” Ignoring news. Revenge trading. Overconfidence after a win.",
          "None of these are strategy problems. They’re decision problems.",
          "FXCO-Pilot exists to force a pre-trade pause to validate your reasoning before you place the trade.",
          "Real-time data doesn’t prevent bad decisions context does. That’s why near-live data is a feature: it’s enough to evaluate market conditions and risk without pretending to be a broker.",
        ],
      },
      {
        title: "What FXCO-Pilot does (in plain English)",
        subtitle: "Not signals. Not predictions. Explainable decision support.",
        accentClass: "from-sky-500/20 via-white to-indigo-500/15",
        bullets: [
          "Input the trade idea (pair, direction, timeframe, intent)",
          "Analyze context (structure, momentum, volatility, risk)",
          "Return explainable insight (assumptions + invalidation)",
        ],
        paragraphs: [
          "FXCO-Pilot is an AI trade validation and decision-support tool. It doesn’t place trades for you. It doesn’t promise guaranteed profits. It doesn’t replace your strategy.",
          "Instead, it acts like a second brain before execution: market direction & structure, momentum vs consolidation, volatility conditions, risk-to-reward logic, and alignment (or conflict) with your bias.",
          "Instead of “Buy” or “Sell,” it gives you what matters: Is the trade aligned with current conditions? Is the risk justified? What assumptions are you making? What could invalidate the setup?",
          "The psychology angle most apps ignore: most traders already know what they should do they just don’t do it consistently. FXCO-Pilot is built to interrupt impulsive entries, emotional overconfidence, confirmation bias, and “just one more trade.”",
          "This isn’t about winning every trade. It’s about fewer stupid losses, better decision consistency, and discipline you can repeat. Profit becomes a side effect of that.",
        ],
      },
    ],
    []
  );

  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0); // seconds into current slide

  // animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1); // 1 next, -1 prev
  const animTimerRef = useRef<number | null>(null);

  // swipe state
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const current = slides[index];
  const progress = clamp((elapsed / 15) * 100, 0, 100);

  function safeSetIndex(nextIndex: number, direction: 1 | -1) {
    if (animTimerRef.current) window.clearTimeout(animTimerRef.current);

    setDir(direction);
    setIsAnimating(true);

    // wait a bit so fade-out begins, then swap content, then fade-in
    animTimerRef.current = window.setTimeout(() => {
      setIndex(nextIndex);
      setElapsed(0);
      // allow fade-in
      window.setTimeout(() => setIsAnimating(false), 160);
    }, 160);
  }

  function goNext() {
    const next = (index + 1) % total;
    safeSetIndex(next, 1);
  }

  function goPrev() {
    const prev = (index - 1 + total) % total;
    safeSetIndex(prev, -1);
  }

  function goTo(i: number) {
    if (i === index) return;
    const direction: 1 | -1 = i > index ? 1 : -1;
    safeSetIndex(i, direction);
  }

  // Auto-advance every 15 seconds + progress
  useEffect(() => {
    const tick = window.setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        if (next >= 15) {
          // trigger animated next
          const nextIdx = (index + 1) % total;
          safeSetIndex(nextIdx, 1);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    };
  }, []);

  // Swipe handlers (touch + trackpad pointer)
  function onPointerDown(e: React.PointerEvent) {
    // only left-click/touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    draggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;

    // capture so we keep receiving events
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    // We don’t visually drag; just detect swipe on end.
    // (Keeping UI “premium” and not jittery.)
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const startX = startXRef.current;
    const startY = startYRef.current;
    if (startX == null || startY == null) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    startXRef.current = null;
    startYRef.current = null;

    // Ignore mostly-vertical gestures (scroll)
    if (Math.abs(dy) > Math.abs(dx)) return;

    // threshold
    const TH = 55;
    if (dx <= -TH) goNext(); // swipe left -> next
    if (dx >= TH) goPrev(); // swipe right -> prev
  }

  // Keyboard support (nice-to-have)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const contentAnimClass = isAnimating
    ? dir === 1
      ? "opacity-0 translate-x-2"
      : "opacity-0 -translate-x-2"
    : "opacity-100 translate-x-0";

  return (
    <section className="mx-auto max-w-5xl px-4 pb-14">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Pill>Reading mode</Pill>
          <Pill>Swipe on mobile</Pill>
          <Pill>Auto slide: 15s</Pill>
          <Pill>
            Section {index + 1}/{total}
          </Pill>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            aria-label="Previous section"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            aria-label="Next section"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Swipe surface */}
      <div
        className="mt-5"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="group"
        aria-label="Article reader slider"
      >
        {/* Square-ish reading box */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm backdrop-blur">
          {/* Color header */}
          <div className={`bg-gradient-to-br ${current.accentClass} p-6 sm:p-7`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div
                className={`transition-all duration-300 ease-out ${contentAnimClass}`}
              >
                <p className="text-xs font-semibold text-slate-600">
                  FXCO-Pilot | Article Reader
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {current.title}
                </h2>
                {current.subtitle ? (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
                    {current.subtitle}
                  </p>
                ) : null}
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-[260px] rounded-2xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur sm:w-[260px]">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>Auto-advance</span>
                  <span>{15 - elapsed}s</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-5 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`h-2.5 w-2.5 rounded-full border transition ${
                    i === index
                      ? "border-slate-900 bg-slate-900"
                      : "border-slate-300 bg-white hover:bg-slate-50"
                  }`}
                  aria-label={`Go to section ${i + 1}`}
                />
              ))}
              <span className="ml-2 text-xs font-semibold text-slate-600">
                Swipe ← / → to switch
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className={`grid gap-6 p-6 transition-all duration-300 ease-out sm:p-7 lg:grid-cols-[0.95fr_1.05fr] ${contentAnimClass}`}
          >
            {/* Left: quick bullets */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Key points</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {(current.bullets || []).map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Mobile controls */}
              <div className="mt-5 flex items-center gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Right: readable text */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">Section text</p>
              <div className="mt-4 space-y-6 text-[15px] leading-[1.75] text-slate-900">
  {current.paragraphs.map((p, i) => (
    <p
      key={p}
      className={`
        font-medium
        ${i === 0 ? "text-base font-semibold tracking-tight" : ""}
      `}
    >
      {p}
    </p>
  ))}
</div>

            </div>
          </div>

          {/* Tiny footer hint */}
          <div className="border-t border-slate-200 bg-white/70 px-6 py-4 text-xs text-slate-600 sm:px-7">
            Tip: swipe left/right on mobile • use ← → keys on desktop • dots jump between sections
          </div>
        </div>
      </div>
    </section>
  );
}
