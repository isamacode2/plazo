import Link from "next/link";

export type Category = {
  id: number;
  slug: string;
  name: string;
  icon: string | null;
};

export default function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="container-px flex flex-wrap gap-2 py-4">
      <Link
        href="/"
        className={`rounded-full border px-3 py-1.5 text-sm ${
          !activeSlug
            ? "border-brand-600 bg-brand-50 text-brand-700"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        All categories
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/?category=${c.slug}`}
          className={`rounded-full border px-3 py-1.5 text-sm ${
            activeSlug === c.slug
              ? "border-brand-600 bg-brand-50 text-brand-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {c.icon} {c.name}
        </Link>
      ))}
    </div>
  );
}
