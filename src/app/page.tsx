import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CategoryNav from "@/components/CategoryNav";
import SearchFilters from "@/components/SearchFilters";
import ListingCard, { ListingCardData } from "@/components/ListingCard";

type SearchParams = {
  category?: string;
  q?: string;
  min?: string;
  max?: string;
  location?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  let query = supabase
    .from("listings")
    .select(
      "id, title, price, currency, location, created_at, status, category_id, listing_images(url, position)"
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(48);

  // Browse feed is for finding things to buy — your own listings belong in
  // "My listings", not mixed in here where it's easy to mistake them for
  // someone else's and click in confused.
  if (user) {
    query = query.neq("user_id", user.id);
  }

  const activeCategory = categories?.find((c) => c.slug === params.category);
  if (activeCategory) {
    query = query.eq("category_id", activeCategory.id);
  }
  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
  }
  if (params.min) {
    query = query.gte("price", Number(params.min));
  }
  if (params.max) {
    query = query.lte("price", Number(params.max));
  }
  if (params.location) {
    query = query.ilike("location", `%${params.location}%`);
  }

  const { data: listings, error } = await query;

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

  return (
    <div>
      <div className="border-b border-gray-200 bg-white">
        <CategoryNav categories={categories ?? []} activeSlug={params.category} />
        <SearchFilters />
      </div>

      <div className="container-px py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-gray-800">
            {activeCategory ? activeCategory.name : "All listings"}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({cards.length} results)
            </span>
          </h1>
          {user && (
            <Link href="/my-listings" className="btn-secondary">
              My listings
            </Link>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">Couldn&apos;t load listings: {error.message}</p>
        )}

        {cards.length === 0 && !error ? (
          <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-gray-500">
            No listings found. Try adjusting your search or{" "}
            <a href="/listings/new" className="text-brand-600 underline">
              post the first one
            </a>
            .
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {cards.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
