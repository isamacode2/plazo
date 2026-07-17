import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/format";
import RatingSummary from "@/components/RatingSummary";
import StarRating from "@/components/StarRating";
import ListingCard, { ListingCardData } from "@/components/ListingCard";

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, location, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!profile) notFound();

  const { data: ratingRow } = await supabase
    .from("profile_ratings")
    .select("average_rating, review_count")
    .eq("user_id", id)
    .maybeSingle();

  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id, title, price, currency, location, created_at, status, listing_images(url, position)"
    )
    .eq("user_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, body, created_at, reviewer:profiles!reviews_reviewer_id_fkey(username, full_name)")
    .eq("reviewee_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  const cards: ListingCardData[] = (listings ?? []).map((l) => {
    const images = (l.listing_images ?? []).slice().sort((a, b) => a.position - b.position);
    return {
      id: l.id,
      title: l.title,
      price: l.price,
      currency: l.currency,
      location: l.location,
      created_at: l.created_at,
      status: l.status,
      image_url: images[0]?.url ?? null,
    };
  });

  const displayName = profile.username || profile.full_name || "User";

  return (
    <div className="container-px py-8">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{displayName}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {profile.location ? `${profile.location} · ` : ""}
              Member since {timeAgo(profile.created_at)}
            </p>
          </div>
          <RatingSummary
            averageRating={ratingRow?.average_rating ?? null}
            reviewCount={ratingRow?.review_count ?? null}
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Active listings ({cards.length})
        </h2>
        {cards.length === 0 ? (
          <p className="text-sm text-gray-500">No active listings right now.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {cards.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Reviews ({reviews?.length ?? 0})
        </h2>
        {!reviews || reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => {
              const reviewer = r.reviewer as unknown as {
                username: string | null;
                full_name: string | null;
              } | null;
              return (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800">
                      {reviewer?.username || reviewer?.full_name || "A user"}
                    </p>
                    <span className="text-xs text-gray-400">{timeAgo(r.created_at)}</span>
                  </div>
                  <StarRating rating={r.rating} />
                  {r.body && <p className="mt-2 text-sm text-gray-700">{r.body}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
