import React from "react";

type Tone = "neutral" | "warn" | "success";
type Size = "sm" | "md";

type Props = {
  /**
   * Optional custom heading. Defaults to "ProfitPilot clarification".
   */
  title?: string;

  /**
   * Canonical copy renders by default.
   * Pass children to override content for special articles.
   */
  children?: React.ReactNode;

  /**
   * neutral: default for most articles
   * warn: best when formulas / "profit today" are mentioned
   * success: best when emphasizing trust/accuracy philosophy
   */
  tone?: Tone;

  /**
   * Controls spacing + typography density.
   */
  size?: Size;

  /**
   * Show the short one-liner above the full block.
   */
  showOneLiner?: boolean;

  /**
   * Override the one-liner text.
   */
  oneLinerText?: string;

  /**
   * Show a subtle hint line (optional).
   */
  showHint?: boolean;
};

export default function ProfitLogicClarification({
  title = "ProfitPilot clarification",
  children,
  tone = "neutral",
  size = "md",
  showOneLiner = false,
  oneLinerText = "Profit is conditional — if the data isn’t complete, the number isn’t shown.",
  showHint = false,
}: Props) {
  const toneStyles =
    tone === "warn"
      ? {
          wrap: "border-amber-200 bg-amber-50 text-amber-950",
          badge: "bg-amber-100 text-amber-900 border-amber-200",
          icon: "text-amber-700",
        }
      : tone === "success"
      ? {
          wrap: "border-emerald-200 bg-emerald-50 text-emerald-950",
          badge: "bg-emerald-100 text-emerald-900 border-emerald-200",
          icon: "text-emerald-700",
        }
      : {
          wrap: "border-slate-200 bg-slate-50 text-slate-900",
          badge: "bg-white text-slate-800 border-slate-200",
          icon: "text-slate-600",
        };

  const sizeStyles =
    size === "sm"
      ? {
          wrap: "p-4",
          title: "text-sm",
          body: "text-sm leading-6",
        }
      : {
          wrap: "p-5",
          title: "text-sm",
          body: "text-sm leading-6",
        };

  return (
    <aside
      className={[
        "rounded-2xl border shadow-sm",
        toneStyles.wrap,
        sizeStyles.wrap,
      ].join(" ")}
      role="note"
      aria-label="Profit logic clarification"
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl border",
            toneStyles.badge,
          ].join(" ")}
          aria-hidden="true"
        >
          <svg className={["h-4 w-4", toneStyles.icon].join(" ")} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M12 10v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={["font-bold", sizeStyles.title].join(" ")}>{title}</p>

            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              no estimates
            </span>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
              no guessing
            </span>
          </div>

          {showOneLiner && <p className={["mt-2 font-semibold", sizeStyles.body].join(" ")}>{oneLinerText}</p>}

          <div className={["mt-2", sizeStyles.body].join(" ")}>
            {children ?? (
              <>
                <p className="m-0">
                  ProfitPilot treats profit as a <strong>conditional</strong> number. Profit is only shown when all
                  required costs (such as Cost of Goods Sold) are fully recorded.
                </p>
                <p className="mt-3 mb-0">
                  If any required cost is missing, ProfitPilot does not estimate or guess — it will show{" "}
                  <strong>“— —”</strong> and clearly explain why profit is unavailable.
                </p>
              </>
            )}
          </div>

          {showHint && (
            <p className="mt-3 mb-0 text-xs text-slate-600">
              Tip: If you see “— —”, record missing item costs (COGS) for the sales in that period.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
