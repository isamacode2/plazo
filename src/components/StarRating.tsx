export default function StarRating({
  rating,
  size = "text-base",
}: {
  rating: number;
  size?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <span className={`inline-flex ${size} leading-none text-amber-500`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= rounded ? "★" : "☆"}</span>
      ))}
    </span>
  );
}
