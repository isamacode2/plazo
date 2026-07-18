"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/components/CategoryNav";
import { PAYMENT_METHODS } from "@/lib/paymentMethods";
import { CURRENCIES } from "@/lib/currencies";
import { ACCRA_LOCATIONS } from "@/lib/accraLocations";

type ExistingImage = { id: string; url: string };

export default function ListingForm({
  categories,
  mode,
  listingId,
  initial,
  existingImages = [],
}: {
  categories: Category[];
  mode: "create" | "edit";
  listingId?: string;
  initial?: {
    title: string;
    description: string;
    price: number | null;
    currency: string;
    location: string | null;
    category_id: number;
    status: string;
    payment_methods?: string[];
  };
  existingImages?: ExistingImage[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [currency, setCurrency] = useState(initial?.currency ?? "USD");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.category_id?.toString() ?? categories[0]?.id.toString() ?? ""
  );
  const [status, setStatus] = useState(initial?.status ?? "active");
  const [paymentMethods, setPaymentMethods] = useState<string[]>(
    initial?.payment_methods ?? []
  );
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<ExistingImage[]>(existingImages);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function removeExistingImage(image: ExistingImage) {
    await supabase.from("listing_images").delete().eq("id", image.id);
    setImages((prev) => prev.filter((i) => i.id !== image.id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in.");
        setSubmitting(false);
        return;
      }

      const payload = {
        title,
        description,
        price: price ? Number(price) : null,
        currency,
        location: location || null,
        category_id: Number(categoryId),
        status: status as "active" | "sold" | "expired" | "draft",
        payment_methods: paymentMethods,
        user_id: user.id,
      };

      let id = listingId;

      if (mode === "create") {
        const { data, error: insertError } = await supabase
          .from("listings")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        id = data.id;
      } else {
        const { error: updateError } = await supabase
          .from("listings")
          .update(payload)
          .eq("id", listingId!);
        if (updateError) throw updateError;
      }

      // Upload any newly selected images
      if (files.length > 0 && id) {
        const startPosition = images.length;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const path = `${user.id}/${id}/${Date.now()}-${i}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(path, file);
          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("listing-images").getPublicUrl(path);

          const { error: imageInsertError } = await supabase.from("listing_images").insert({
            listing_id: id,
            url: publicUrl,
            position: startPosition + i,
          });
          if (imageInsertError) throw imageInsertError;
        }
      }

      router.push(`/listings/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label className="label" htmlFor="title">
          Title
        </label>
        <input
          className="input"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={120}
        />
      </div>

      <div>
        <label className="label" htmlFor="category">
          Category
        </label>
        <select
          className="input"
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="price">
            Price (leave blank for free/contact)
          </label>
          <div className="flex gap-2">
            <select
              className="input w-28 shrink-0"
              id="currency"
              aria-label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>
            <input
              className="input min-w-0 flex-1"
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="location">
            Location
          </label>
          <select
            className="input"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an area
            </option>
            {ACCRA_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          Description
        </label>
        <textarea
          className="input min-h-32"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <p className="label">Accepted payment methods</p>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => {
            const checked = paymentMethods.includes(m.value);
            return (
              <label
                key={m.value}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                  checked
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() =>
                    setPaymentMethods((prev) =>
                      checked ? prev.filter((v) => v !== m.value) : [...prev, m.value]
                    )
                  }
                />
                {m.label}
              </label>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          This just tells buyers what you accept — Plazo doesn&apos;t process payments.
          Always meet in a safe public place and confirm the item before paying.
        </p>
      </div>

      {mode === "edit" && (
        <div>
          <label className="label" htmlFor="status">
            Status
          </label>
          <select
            className="input"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <p className="label">Current photos</p>
          <div className="flex flex-wrap gap-2">
            {images.map((img) => (
              <div key={img.id} className="relative h-20 w-20">
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="rounded-md object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="label" htmlFor="images">
          {mode === "create" ? "Photos" : "Add more photos"}
        </label>
        <input
          className="input"
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
      </div>

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Saving..." : mode === "create" ? "Post listing" : "Save changes"}
      </button>
    </form>
  );
}
