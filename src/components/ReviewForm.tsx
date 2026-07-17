"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ExistingReview = { rating: number; body: string } | null;

export default function ReviewForm({
  conversationId,
  revieweeId,
  revieweeName,
  existingReview,
}: {
  conversationId: string;
  revieweeId: string;
  revieweeName: string;
  existingReview: ExistingReview;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRating, setSavedRating] = useState(existingReview?.rating ?? null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Pick a star rating first.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setSubmitting(false);
      return;
    }

    const { error: upsertError } = await supabase.from("reviews").upsert(
      {
        conversation_id: conversationId,
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        rating,
        body,
      },
      { onConflict: "conversation_id,reviewer_id" }
    );

    setSubmitting(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setSavedRating(rating);
    setOpen(false);
    router.refresh();
  }

  if (!open && savedRating) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
        You rated {revieweeName} {savedRating} {savedRating === 1 ? "star" : "stars"}.{" "}
        <button type="button" onClick={() => setOpen(true)} className="text-brand-600 underline">
          Edit
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary">
        Rate {revieweeName}
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-md border border-gray-200 p-3">
      <div className="flex items-center gap-1 text-2xl text-amber-500">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i)}
            aria-label={`${i} star${i === 1 ? "" : "s"}`}
          >
            {i <= (hoverRating || rating) ? "★" : "☆"}
          </button>
        ))}
      </div>
      <textarea
        className="input min-h-20"
        placeholder={`How was your experience with ${revieweeName}?`}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : "Submit review"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
