// app/components/PageHeader.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export default function PageHeader({
  badge,
  title,
  subtitle,
  actions,
  level = 1,

  // ✅ NEW (optional context link)
  contextLabel,
  contextHref,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  level?: 1 | 2;

  // ✅ NEW
  contextLabel?: string;
  contextHref?: string;
}) {
  const HeadingTag = level === 1 ? "h1" : "h2";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {/* ✅ Context / breadcrumb (optional) */}
        {contextLabel && contextHref ? (
          <Link
            href={contextHref}
            className="inline-block text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
          >
            {contextLabel}
          </Link>
        ) : null}

        {/* Badge */}
        {badge ? (
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 ${
              contextLabel ? "mt-4" : ""
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
            {badge}
          </div>
        ) : null}

        {/* Title */}
        <HeadingTag
          className={`font-bold tracking-tight text-slate-950 ${
            level === 1 ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
          } ${badge || contextLabel ? "mt-6" : ""}`}
        >
          {title}
        </HeadingTag>

        {/* Subtitle */}
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-base font-semibold text-slate-800">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Actions */}
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}
