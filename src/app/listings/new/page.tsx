import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ListingForm from "@/components/ListingForm";

export default async function NewListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Log in to post a listing."));
  }

  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div className="container-px max-w-2xl py-8">
      <h1 className="mb-6 text-xl font-semibold">Post a new listing</h1>
      <ListingForm categories={categories ?? []} mode="create" />
    </div>
  );
}
