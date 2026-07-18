"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ConfirmAvailableButton({ listingId }: { listingId: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error } = await supabase
      .from("listings")
      .update({
        last_confirmed_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        status: "active",
      })
      .eq("id", listingId);

    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={loading}
      className="text-xs font-medium text-brand-600 underline hover:text-brand-700"
    >
      {loading ? "Confirming..." : "Still available? Confirm"}
    </button>
  );
}
