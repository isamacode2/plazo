import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const EVENT_LABELS: Record<string, string> = {
  signup: "Signups",
  listing_posted: "Listings posted",
  message_sent: "Messages sent",
  report_filed: "Reports filed",
  listing_viewed: "Listing views",
};

function labelFor(eventType: string) {
  return EVENT_LABELS[eventType] ?? eventType;
}

export default async function AdminAnalyticsPage() {
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

  const [{ data: totals, error: totalsError }, { data: daily, error: dailyError }] =
    await Promise.all([
      supabase.rpc("admin_event_totals"),
      supabase.rpc("admin_daily_event_counts", { p_days: 14 }),
    ]);

  const eventTypes = Array.from(
    new Set([...(totals ?? []).map((t) => t.event_type), ...(daily ?? []).map((d) => d.event_type)])
  ).sort();

  const days = Array.from(new Set((daily ?? []).map((d) => d.day))).sort((a, b) =>
    b.localeCompare(a)
  );

  const dailyLookup = new Map<string, number>();
  for (const row of daily ?? []) {
    dailyLookup.set(`${row.day}|${row.event_type}`, Number(row.count));
  }

  return (
    <div className="container-px py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Admin · Analytics</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="btn-secondary">
            Reports
          </Link>
          <Link href="/" className="btn-secondary">
            Back to site
          </Link>
        </div>
      </div>

      {(totalsError || dailyError) && (
        <p className="mb-4 text-sm text-red-600">
          Couldn&apos;t load analytics: {totalsError?.message ?? dailyError?.message}
        </p>
      )}

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        All-time totals
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {(totals ?? []).length === 0 && (
          <p className="col-span-full text-sm text-gray-500">No events logged yet.</p>
        )}
        {(totals ?? []).map((t) => (
          <div key={t.event_type} className="card p-4 text-center">
            <p className="text-2xl font-bold text-brand-700">{t.count}</p>
            <p className="mt-1 text-xs text-gray-500">{labelFor(t.event_type)}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Last 14 days
      </h2>
      {days.length === 0 ? (
        <p className="text-sm text-gray-500">Nothing in the last 14 days yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-2 pr-4">Date</th>
                {eventTypes.map((et) => (
                  <th key={et} className="py-2 pr-4">
                    {labelFor(et)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-700">{day}</td>
                  {eventTypes.map((et) => (
                    <td key={et} className="py-2 pr-4 text-gray-700">
                      {dailyLookup.get(`${day}|${et}`) ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
