import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { timeAgo } from "@/lib/format";

export default async function MessagesInboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Log in to view your messages."));
  }

  const { data: conversations } = await supabase
    .from("conversations")
    .select(
      `id, created_at, listing_id,
       listings(title),
       buyer:profiles!conversations_buyer_id_fkey(id, username, full_name),
       seller:profiles!conversations_seller_id_fkey(id, username, full_name)`
    )
    .order("created_at", { ascending: false });

  const ids = (conversations ?? []).map((c) => c.id);
  const { data: messages } = ids.length
    ? await supabase
        .from("messages")
        .select("conversation_id, body, created_at, sender_id, read_at")
        .in("conversation_id", ids)
        .order("created_at", { ascending: false })
    : {
        data: [] as {
          conversation_id: string;
          body: string;
          created_at: string;
          sender_id: string;
          read_at: string | null;
        }[],
      };

  const lastMessageByConversation = new Map<string, { body: string; created_at: string }>();
  const unreadConversations = new Set<string>();
  for (const m of messages ?? []) {
    if (!lastMessageByConversation.has(m.conversation_id)) {
      lastMessageByConversation.set(m.conversation_id, { body: m.body, created_at: m.created_at });
    }
    if (m.read_at === null && m.sender_id !== user!.id) {
      unreadConversations.add(m.conversation_id);
    }
  }

  return (
    <div className="container-px max-w-2xl py-8">
      <h1 className="mb-6 text-xl font-semibold">Messages</h1>

      {!conversations || conversations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-gray-500">
          No conversations yet. Contact a seller from a listing page to start one.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {conversations.map((c) => {
            const buyer = c.buyer as unknown as { id: string; username: string | null; full_name: string | null };
            const seller = c.seller as unknown as { id: string; username: string | null; full_name: string | null };
            const other = user!.id === buyer?.id ? seller : buyer;
            const listing = c.listings as unknown as { title: string } | null;
            const last = lastMessageByConversation.get(c.id);
            const unread = unreadConversations.has(c.id);

            return (
              <Link
                key={c.id}
                href={`/messages/${c.id}`}
                className={`flex items-center justify-between gap-4 p-4 hover:bg-gray-50 ${
                  unread ? "bg-brand-50/60" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  {unread && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`truncate ${
                        unread ? "font-semibold text-gray-900" : "font-medium text-gray-900"
                      }`}
                    >
                      {other?.username || other?.full_name || "User"}
                    </p>
                    <p className="truncate text-sm text-gray-500">{listing?.title}</p>
                    {last && (
                      <p
                        className={`truncate text-sm ${unread ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {last.body}
                      </p>
                    )}
                  </div>
                </div>
                {last && (
                  <span className="shrink-0 text-xs text-gray-400">{timeAgo(last.created_at)}</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
