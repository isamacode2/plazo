"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminReportActions({
  reportId,
  reportedListingId,
  reportedListingStatus,
  targetUserId,
  targetUserSuspended,
}: {
  reportId: string;
  reportedListingId: string | null;
  reportedListingStatus: string | null;
  targetUserId: string | null;
  targetUserSuspended: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(
    key: string,
    fn: () => PromiseLike<{ error: { message: string } | null }>
  ) {
    setBusy(key);
    setError(null);
    const { error } = await fn();
    setBusy(null);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
  }

  const setReportStatus = (status: "resolved" | "dismissed") =>
    run(status, () =>
      supabase
        .from("reports")
        .update({ status, resolved_at: new Date().toISOString() })
        .eq("id", reportId)
    );

  const removeListing = () =>
    run("remove-listing", () =>
      supabase.from("listings").update({ status: "removed" }).eq("id", reportedListingId!)
    );

  const restoreListing = () =>
    run("restore-listing", () =>
      supabase.from("listings").update({ status: "active" }).eq("id", reportedListingId!)
    );

  const toggleSuspend = () =>
    run("suspend", () =>
      supabase
        .from("profiles")
        .update({ is_suspended: !targetUserSuspended })
        .eq("id", targetUserId!)
    );

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => setReportStatus("resolved")}
        disabled={busy !== null}
        className="btn-secondary text-xs"
      >
        {busy === "resolved" ? "Saving..." : "Mark resolved"}
      </button>
      <button
        type="button"
        onClick={() => setReportStatus("dismissed")}
        disabled={busy !== null}
        className="btn-secondary text-xs"
      >
        {busy === "dismissed" ? "Saving..." : "Dismiss"}
      </button>

      {reportedListingId && reportedListingStatus !== "removed" && (
        <button
          type="button"
          onClick={removeListing}
          disabled={busy !== null}
          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {busy === "remove-listing" ? "Removing..." : "Remove listing"}
        </button>
      )}
      {reportedListingId && reportedListingStatus === "removed" && (
        <button
          type="button"
          onClick={restoreListing}
          disabled={busy !== null}
          className="btn-secondary text-xs"
        >
          {busy === "restore-listing" ? "Restoring..." : "Restore listing"}
        </button>
      )}

      {targetUserId && (
        <button
          type="button"
          onClick={toggleSuspend}
          disabled={busy !== null}
          className={`rounded-md px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60 ${
            targetUserSuspended ? "bg-gray-500 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {busy === "suspend"
            ? "Saving..."
            : targetUserSuspended
              ? "Unsuspend user"
              : "Suspend user"}
        </button>
      )}

      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </div>
  );
}
