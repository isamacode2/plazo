import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/format";
import AdminReportActions from "@/components/AdminReportActions";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Log in to access the admin dashboard."));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/");
  }

  const { data: reports, error } = await supabase
    .from("reports")
    .select(
      `id, reason, details, status, created_at, resolved_at,
       reporter:profiles!reports_reporter_id_fkey(id, username),
       reported_user:profiles!reports_reported_user_id_fkey(id, username, is_suspended),
       reported_listing:listings!reports_reported_listing_id_fkey(id, title, status, user_id)`
    )
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  type Row = {
    id: string;
    reason: string;
    details: string | null;
    status: string;
    created_at: string;
    resolved_at: string | null;
    reporter: { id: string; username: string | null } | null;
    reported_user: { id: string; username: string | null; is_suspended: boolean } | null;
    reported_listing: { id: string; title: string; status: string; user_id: string } | null;
  };

  const rows = (reports ?? []) as unknown as Row[];
  const open = rows.filter((r) => r.status === "open");
  const closed = rows.filter((r) => r.status !== "open");

  return (
    <div className="container-px py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Admin · Reports</h1>
        <div className="flex gap-2">
          <Link href="/admin/analytics" className="btn-secondary">
            Analytics
          </Link>
          <Link href="/" className="btn-secondary">
            Back to site
          </Link>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">Couldn&apos;t load reports: {error.message}</p>
      )}

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Open ({open.length})
      </h2>
      {open.length === 0 ? (
        <p className="mb-6 text-sm text-gray-500">Nothing open — you&apos;re all caught up.</p>
      ) : (
        <div className="mb-8 flex flex-col gap-3">
          {open.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{r.reason}</p>
                  <p className="text-xs text-gray-500">
                    Reported by {r.reporter?.username ?? "a user"} · {timeAgo(r.created_at)}
                  </p>
                </div>
              </div>

              {r.details && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{r.details}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                {r.reported_listing && (
                  <Link
                    href={`/listings/${r.reported_listing.id}`}
                    target="_blank"
                    className="text-brand-600 underline"
                  >
                    View listing: {r.reported_listing.title} ({r.reported_listing.status})
                  </Link>
                )}
                {r.reported_user && (
                  <Link
                    href={`/users/${r.reported_user.id}`}
                    target="_blank"
                    className="text-brand-600 underline"
                  >
                    View profile: {r.reported_user.username ?? "user"}
                    {r.reported_user.is_suspended ? " (suspended)" : ""}
                  </Link>
                )}
              </div>

              <AdminReportActions
                reportId={r.id}
                reportedListingId={r.reported_listing?.id ?? null}
                reportedListingStatus={r.reported_listing?.status ?? null}
                targetUserId={r.reported_user?.id ?? r.reported_listing?.user_id ?? null}
                targetUserSuspended={r.reported_user?.is_suspended ?? false}
              />
            </div>
          ))}
        </div>
      )}

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Resolved ({closed.length})
      </h2>
      {closed.length === 0 ? (
        <p className="text-sm text-gray-500">No history yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {closed.map((r) => (
            <div key={r.id} className="rounded-md border border-gray-200 p-3 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">{r.reason}</span> ·{" "}
                <span className="text-gray-500">{r.status}</span>
              </p>
              <p className="text-xs text-gray-400">
                Reported by {r.reporter?.username ?? "a user"} · {timeAgo(r.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
