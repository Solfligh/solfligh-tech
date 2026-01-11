// app/components/PageHeader.tsx
import type { ReactNode } from "react";

export default function PageHeader({
  badge,
  title,
  subtitle,
  actions,
  level = 1,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  level?: 1 | 2;
}) {
  const HeadingTag = level === 1 ? "h1" : "h2";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {badge ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
            {badge}
          </div>
        ) : null}

        <HeadingTag
          className={`font-bold tracking-tight text-slate-950 ${
            level === 1 ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
          } ${badge ? "mt-6" : ""}`}
        >
          {title}
        </HeadingTag>

        {subtitle ? (
          <p className="mt-4 max-w-2xl text-base font-semibold text-slate-800">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}
