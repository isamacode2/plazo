"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this listing? This can't be undone.")) return;
    setLoading(true);
    const { error } = await supabase.from("listings").delete().eq("id", listingId);
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.push("/my-listings");
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="btn-secondary text-red-600">
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
