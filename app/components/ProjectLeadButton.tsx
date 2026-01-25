"use client";

import { useState } from "react";
import LeadCaptureForm from "@/app/components/LeadCaptureForm";

type Props = {
  projectSlug: string;
  projectName?: string;
  source?: string;
  buttonLabel?: string;
};

export default function ProjectLeadButton({
  projectSlug,
  projectName,
  source = "projects_page",
  buttonLabel = "Join waitlist",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur transition hover:bg-white"
      >
        {buttonLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Join waitlist modal"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="text-sm font-semibold text-slate-900">
                Join waitlist — {projectName || projectSlug}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="p-5">
              <LeadCaptureForm
                projectSlug={projectSlug}
                projectName={projectName}
                source={source}
                onSuccess={() => {
                  // Close after success (small delay looks nicer)
                  setTimeout(() => setOpen(false), 600);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
