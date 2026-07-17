import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";

export default async function Footer() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .order("sort_order")
    .limit(6);

  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-px grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-lg font-bold text-brand-700">
            <Logo className="h-6 w-6 text-brand-600" />
            <span>Plazo</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            A local marketplace for buying, selling, and connecting nearby.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Categories</p>
          <ul className="mt-3 space-y-2">
            {(categories ?? []).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/?category=${c.slug}`}
                  className="text-sm text-gray-500 hover:text-brand-600"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Company</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/about" className="text-sm text-gray-500 hover:text-brand-600">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-brand-600">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/listings/new" className="text-sm text-gray-500 hover:text-brand-600">
                Post an ad
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Legal</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-brand-600">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-brand-600">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-4 text-xs text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Plazo. All rights reserved.</p>
          <p>Made for Accra, Ghana &amp; Croatia.</p>
        </div>
      </div>
    </footer>
  );
}
