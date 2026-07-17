import Link from "next/link";
import Image from "next/image";
import { formatPrice, timeAgo } from "@/lib/format";

export type ListingCardData = {
  id: string;
  title: string;
  price: number | null;
  currency: string;
  location: string | null;
  created_at: string;
  status: string;
  image_url: string | null;
};

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="card group flex flex-col overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 text-4xl">
            📷
          </div>
        )}
        {listing.status === "sold" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded bg-white px-2 py-1 text-xs font-semibold uppercase">
              Sold
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="font-semibold text-brand-700">
          {formatPrice(listing.price, listing.currency)}
        </p>
        <p className="line-clamp-2 text-sm text-gray-800">{listing.title}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-gray-500">
          <span className="truncate">{listing.location || "Unknown location"}</span>
          <span className="shrink-0">{timeAgo(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
