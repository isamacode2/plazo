"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function BlockButton({
  userId,
  alreadyBlocked = false,
}: {
  userId: string;
  alreadyBlocked?: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(alreadyBlocked);

  async function handleBlock() {
    if (
      !confirm(
        "Block this user? They won't be able to message you, and you won't see their listings."
      )
    )
      return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .insert({ blocker_id: user.id, blocked_id: userId });

    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    setBlocked(true);
    router.refresh();
  }

  async function handleUnblock() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_id", userId);

    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    setBlocked(false);
    router.refresh();
  }

  if (blocked) {
    return (
      <button
        type="button"
        onClick={handleUnblock}
        disabled={loading}
        className="text-sm text-gray-500 underline hover:text-brand-600"
      >
        {loading ? "Unblocking..." : "Unblock user"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleBlock}
      disabled={loading}
      className="text-sm text-gray-500 underline hover:text-red-600"
    >
      {loading ? "Blocking..." : "Block user"}
    </button>
  );
}
