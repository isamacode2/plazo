import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListingCard, { ListingCardData } from "@/components/ListingCard";
import ConfirmAvailableButton from "@/components/ConfirmAvailableButton";
import { expiryLabel, daysUntil } from "@/lib/listingExpiry";

export default async function MyListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Log in to see your listings."));
  }

  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id, title, price, currency, location, created_at, status, expires_at, listing_images(url, position)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (listings ?? []).map((l) => {
    const images = (l.listing_images ?? []).slice().sort((a, b) => a.position - b.position);
    const card: ListingCardData = {
      id: l.id,
      title: l.title,
      price: l.price,
      currency: l.currency,
      location: l.location,
      created_at: l.created_at,
      status: l.status,
      image_url: images[0]?.url ?? null,
    };
    return { card, status: l.status, expiresAt: l.expires_at };
  });

  return (
    <div className="container-px py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My listings</h1>
        <Link href="/listings/new" className="btn-primary">
          + Post ad
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-gray-500">
          You haven&apos;t posted anything yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {rows.map(({ card, status, expiresAt }) => {
            const expiringSoon = status === "active" && daysUntil(expiresAt) <= 5;
            return (
              <div key={card.id} className="flex flex-col gap-1.5">
                <ListingCard listing={card} />
                {status === "active" && (
                  <div className="flex items-center justify-between gap-2 px-0.5">
                    <span
                      className={`text-xs ${expiringSoon ? "font-medium text-amber-600" : "text-gray-400"}`}
                    >
                      {expiryLabel(expiresAt)}
                    </span>
                    <ConfirmAvailableButton listingId={card.id} />
                  </div>
                )}
                {status === "expired" && (
                  <div className="flex items-center justify-between gap-2 px-0.5">
                    <span className="text-xs text-gray-400">Expired — no longer listed</span>
                    <ConfirmAvailableButton listingId={card.id} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
