import StarRating from "@/components/StarRating";

export default function RatingSummary({
  averageRating,
  reviewCount,
}: {
  averageRating: number | null;
  reviewCount: number | null;
}) {
  if (!reviewCount) {
    return <span className="text-sm text-gray-400">No reviews yet</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
      <StarRating rating={averageRating ?? 0} />
      <span>
        {averageRating?.toFixed(1)} · {reviewCount} review{reviewCount === 1 ? "" : "s"}
      </span>
    </span>
  );
}
