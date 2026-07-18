import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/database.types";

// Event logging for the admin analytics dashboard. Never throws — a failed
// analytics write should never break the user's action. Returns a promise;
// callers in server actions (which may redirect() right after) should await
// it, client components can fire-and-forget.
export async function logEvent(
  supabase: SupabaseClient<Database>,
  eventType: string,
  opts: { userId?: string | null; metadata?: Record<string, Json> } = {}
) {
  const { error } = await supabase.from("events").insert({
    event_type: eventType,
    user_id: opts.userId ?? null,
    metadata: opts.metadata ?? {},
  });
  if (error) {
    // Don't let analytics noise show up as a user-facing error; just log it.
    console.warn("logEvent failed:", eventType, error.message);
  }
}
