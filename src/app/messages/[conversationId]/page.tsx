import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MessageThread from "@/components/MessageThread";
import ScamWarningBanner from "@/components/ScamWarningBanner";
import ReviewForm from "@/components/ReviewForm";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Log in to view this conversation."));
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      `id, listing_id,
       listings(id, title, categories(slug)),
       buyer:profiles!conversations_buyer_id_fkey(id, username, full_name),
       seller:profiles!conversations_seller_id_fkey(id, username, full_name)`
    )
    .eq("id", conversationId)
    .maybeSingle();

  if (!conversation) notFound();

  const buyer = conversation.buyer as unknown as { id: string; username: string | null; full_name: string | null };
  const seller = conversation.seller as unknown as { id: string; username: string | null; full_name: string | null };
  const listing = conversation.listings as unknown as {
    id: string;
    title: string;
    categories: { slug: string } | null;
  } | null;
  const other = user.id === buyer?.id ? seller : buyer;

  const { data: messages } = await supabase
    .from("messages")
    .select("id, body, created_at, sender_id")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  // Mark the other person's messages as read now that this conversation is
  // open — clears the unread badge in the nav.
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("rating, body")
    .eq("conversation_id", conversationId)
    .eq("reviewer_id", user.id)
    .maybeSingle();

  return (
    <div className="container-px max-w-2xl py-8">
      <div className="mb-4">
        <Link href="/messages" className="text-sm text-brand-600 hover:underline">
          ← All messages
        </Link>
        <h1 className="mt-1 text-xl font-semibold">
          {other?.username || other?.full_name || "Conversation"}
        </h1>
        {listing && (
          <Link href={`/listings/${listing.id}`} className="text-sm text-gray-500 hover:underline">
            Re: {listing.title}
          </Link>
        )}
      </div>

      <div className="mb-4">
        <ScamWarningBanner categorySlug={listing?.categories?.slug} />
      </div>

      <MessageThread
        conversationId={conversationId}
        currentUserId={user.id}
        initialMessages={messages ?? []}
      />

      {other && (
        <div className="mt-4">
          <ReviewForm
            conversationId={conversationId}
            revieweeId={other.id}
            revieweeName={other.username || other.full_name || "this user"}
            existingReview={existingReview ?? null}
          />
        </div>
      )}
    </div>
  );
}
