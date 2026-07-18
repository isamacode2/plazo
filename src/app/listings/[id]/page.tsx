import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, timeAgo } from "@/lib/format";
import ContactSellerButton from "@/components/ContactSellerButton";
import DeleteListingButton from "@/components/DeleteListingButton";
import ShareButton from "@/components/ShareButton";
import ScamWarningBanner from "@/components/ScamWarningBanner";
import ListingImageGallery from "@/components/ListingImageGallery";
import RatingSummary from "@/components/RatingSummary";
import { paymentMethodLabel } from "@/lib/paymentMethods";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "id, title, description, price, currency, location, status, created_at, user_id, category_id, payment_methods, listing_images(id, url, position), profiles(username, full_name), categories(name, slug)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!listing) notFound();

  const { data: ratingRow } = await supabase
    .from("profile_ratings")
    .select("average_rating, review_count")
    .eq("user_id", listing.user_id)
    .maybeSingle();

  const images = (listing.listing_images ?? []).slice().sort((a, b) => a.position - b.position);
  const isOwner = user?.id === listing.user_id;
  const seller = listing.profiles as unknown as { username: string | null; full_name: string | null } | null;
  const category = listing.categories as unknown as { name: string; slug: string } | null;

  return (
    <div className="container-px py-8">
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/?category=${category.slug}`} className="hover:underline">
              {category.name}
            </Link>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ListingImageGallery images={images} title={listing.title} />

          <div className="mt-6">
            <h1 className="text-2xl font-semibold text-gray-900">{listing.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {listing.location || "Unknown location"} · {timeAgo(listing.created_at)}
              {listing.status !== "active" && (
                <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs uppercase">
                  {listing.status}
                </span>
              )}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-gray-700">{listing.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-5">
            <p className="text-2xl font-bold text-brand-700">
              {formatPrice(listing.price, listing.currency)}
            </p>
            <Link
              href={`/users/${listing.user_id}`}
              className="mt-1 block text-sm text-gray-500 hover:text-brand-600 hover:underline"
            >
              Listed by {seller?.username || seller?.full_name || "a user"}
            </Link>
            <div className="mt-1">
              <RatingSummary
                averageRating={ratingRow?.average_rating ?? null}
                reviewCount={ratingRow?.review_count ?? null}
              />
            </div>

            {listing.payment_methods && listing.payment_methods.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {listing.payment_methods.map((m) => (
                  <span
                    key={m}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                  >
                    {paymentMethodLabel(m)}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2">
              {isOwner ? (
                <>
                  <Link href={`/listings/${listing.id}/edit`} className="btn-secondary w-full">
                    Edit listing
                  </Link>
                  <DeleteListingButton listingId={listing.id} />
                </>
              ) : (
                <ContactSellerButton listingId={listing.id} sellerId={listing.user_id} />
              )}
              <ShareButton title={listing.title} />
            </div>

            {!isOwner && (
              <div className="mt-4">
                <ScamWarningBanner categorySlug={category?.slug} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
