"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");

  function submit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    setOrDelete("q", q);
    setOrDelete("min", minPrice);
    setOrDelete("max", maxPrice);
    setOrDelete("location", location);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="container-px grid grid-cols-2 gap-2 pb-4 sm:grid-cols-5"
    >
      <input
        className="input col-span-2 sm:col-span-2"
        placeholder="Search listings..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        className="input"
        placeholder="Min price"
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        className="input"
        placeholder="Max price"
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <input
        className="input"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button type="submit" className="btn-primary col-span-2 sm:col-span-5">
        Search
      </button>
    </form>
  );
}
