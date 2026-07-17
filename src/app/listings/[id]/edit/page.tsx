import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListingForm from "@/components/ListingForm";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Log in to edit this listing."));
  }

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "id, user_id, title, description, price, currency, location, category_id, status, payment_methods, created_at, updated_at, listing_images(id, url, position)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!listing) notFound();
  if (listing.user_id !== user.id) {
    redirect("/my-listings");
  }

  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  const images = (listing.listing_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((i) => ({ id: i.id, url: i.url }));

  return (
    <div className="container-px max-w-2xl py-8">
      <h1 className="mb-6 text-xl font-semibold">Edit listing</h1>
      <ListingForm
        categories={categories ?? []}
        mode="edit"
        listingId={listing.id}
        initial={{
          title: listing.title,
          description: listing.description,
          price: listing.price,
          currency: listing.currency,
          location: listing.location,
          category_id: listing.category_id,
          status: listing.status,
          payment_methods: listing.payment_methods,
        }}
        existingImages={images}
      />
    </div>
  );
}
