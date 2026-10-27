"use client";

import { useState } from "react";

/** An explicitly simulated explanation, never a connection to an app account. */
export default function JereOfflineWalkthrough() {
  const [stage, setStage] = useState<"ready" | "offline" | "sent">("ready");
  const [sales, setSales] = useState(0);
  return <div className="mt-7 rounded-2xl border border-[#d8d1ed] bg-white p-6 sm:p-8">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#7765be]">Interactive illustration · practice data</p>
    <h3 className="mt-3 text-xl font-semibold">See how two sales wait and send</h3>
    <p className="mt-3 text-sm leading-relaxed text-[#625c70]">This illustration simulates a lost connection and two made-up sales. It does not record or send anything to a Jèrè account.</p>
    <div aria-live="polite" aria-atomic="true" className="mt-6 rounded-xl bg-[#f1eef8] p-5">
      <p className="font-semibold">{stage === "ready" ? "1. Prepare online" : stage === "offline" ? "2. Save on the phone" : "3. Reconnect and send"}</p>
      <p className="mt-2 text-sm leading-relaxed text-[#625c70]">{stage === "ready" ? "In Jèrè, open Sell online first so the phone has a copy of your products. Now try the illustration below." : stage === "offline" ? sales < 2 ? `Connection simulated as offline. Add ${sales === 0 ? "two separate practice sales" : "one more practice sale"}.` : "Two separate practice sales are waiting. Reconnect to see the next step." : "Example sending complete. Both practice entries remain separate; repeating a send should not create another sale."}</p>
      {sales > 0 && <ul className="mt-4 space-y-2 text-sm">{Array.from({ length: sales }, (_, i) => <li key={i} className="flex flex-wrap justify-between gap-2 rounded-lg bg-white px-3 py-3"><span>Practice sale {i + 1} · ₦100</span><span className="font-semibold text-[#5546e8]">{stage === "sent" ? "Sent in this example" : "Waiting in this example"}</span></li>)}</ul>}
    </div>
    <div className="mt-5 flex flex-wrap gap-3">
      {stage === "ready" && <button type="button" onClick={() => setStage("offline")} className="min-h-12 rounded-xl bg-[#5546e8] px-5 py-3 text-sm font-semibold text-white">Simulate lost connection</button>}
      {stage === "offline" && <>
        <button type="button" disabled={sales >= 2} onClick={() => setSales(n => Math.min(2, n + 1))} className="min-h-12 rounded-xl bg-[#5546e8] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Add practice sale</button>
        <button type="button" disabled={sales < 2} onClick={() => setStage("sent")} className="min-h-12 rounded-xl border border-[#5546e8] px-5 py-3 text-sm font-semibold text-[#5546e8] disabled:opacity-40">Simulate reconnection</button>
      </>}
      {stage !== "ready" && <button type="button" onClick={() => { setStage("ready"); setSales(0); }} className="min-h-12 rounded-xl px-3 py-3 text-sm font-semibold text-[#625c70] underline underline-offset-4">Restart illustration</button>}
    </div>
  </div>;
}
