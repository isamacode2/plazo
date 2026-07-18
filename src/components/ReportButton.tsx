"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const REASONS = [
  "Prohibited or illegal item",
  "Scam or fraud",
  "Spam or fake listing",
  "Offensive content",
  "Harassment",
  "Other",
];

export default function ReportButton({
  listingId,
  userId,
  label = "Report",
}: {
  listingId?: string;
  userId?: string;
  label?: string;
}) {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to report something.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_listing_id: listingId ?? null,
      reported_user_id: userId ?? null,
      reason,
      details: details.trim() || null,
    });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return <p className="text-sm text-gray-500">Thanks — we&apos;ve received your report.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-gray-500 underline hover:text-red-600"
      >
        {label}
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-3"
    >
      <label className="label" htmlFor="report-reason">
        Why are you reporting this?
      </label>
      <select
        id="report-reason"
        className="input"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        {REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <textarea
        className="input min-h-16"
        placeholder="Any extra detail (optional)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Sending..." : "Submit report"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
