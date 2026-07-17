"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, IndianRupee, ArrowLeft } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const PACKS = [
  { credits: 50, price: 50, tag: "" },
  { credits: 200, price: 200, tag: "Most popular" },
  { credits: 500, price: 500, tag: "Best value" },
];

export default function BillingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [pending, setPending] = useState<number | null>(null);
  const [note, setNote] = useState("");

  async function buyCredits(amount: number) {
    setPending(amount);
    setNote("");

    // ---------------------------------------------------------------
    // NOT WIRED TO A REAL PAYMENT PROVIDER YET.
    // To go live: create `POST /payments/create-order` on the backend
    // (Razorpay Orders API, amount in paise = amount * 100), open
    // Razorpay Checkout here with the returned order_id, then verify
    // the payment signature server-side in a webhook before crediting
    // the user's `credits` column. Wiring fake success here would be
    // worse than saying plainly that it isn't connected yet.
    // ---------------------------------------------------------------
    await new Promise((r) => setTimeout(r, 900));
    setPending(null);
    setNote(
      "Payments aren't connected yet — this screen is ready for Razorpay, but no real charge happens here.",
    );
  }

  return (
    <div className="min-h-screen bg-ink px-6 py-16 text-paper sm:px-10">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-paper-dim transition hover:text-signal"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
          Credits
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold">
          ₹1 = 1 credit
        </h1>
        <p className="mt-3 max-w-xl text-paper-dim">
          Every new account starts with 5 free credits. Buy more as you go —
          no subscription.
        </p>

        <div className="glass-surface mt-8 inline-flex items-center gap-3 rounded-full px-5 py-3">
          <Zap size={18} className="text-signal" />
          <span className="font-mono text-sm text-paper-dim">
            Current balance
          </span>
          <span className="font-display text-xl font-bold text-signal">
            {user?.credits ?? 0}
          </span>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PACKS.map((pack) => (
            <motion.div
              key={pack.credits}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-surface relative rounded-2xl p-7 text-center"
            >
              {pack.tag && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-signal px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink">
                  {pack.tag}
                </span>
              )}
              <p className="font-display text-4xl font-bold text-signal">
                {pack.credits}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim/60">
                credits
              </p>
              <p className="mt-5 flex items-center justify-center gap-1 text-2xl font-semibold">
                <IndianRupee size={18} />
                {pack.price}
              </p>
              <button
                onClick={() => buyCredits(pack.price)}
                disabled={pending !== null}
                className="glow-signal mt-6 w-full rounded-full bg-signal py-3 font-semibold text-ink transition hover:bg-signal-2 disabled:opacity-60"
              >
                {pending === pack.price ? "Processing…" : "Buy"}
              </button>
            </motion.div>
          ))}
        </div>

        {note && (
          <p className="mt-8 rounded-xl border border-line-strong bg-ink-2/60 p-4 font-mono text-sm text-paper-dim">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
