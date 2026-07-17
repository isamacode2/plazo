import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import Logo from "@/components/Logo";
import StickyHeader from "@/components/StickyHeader";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <StickyHeader>
      <div className="container-px flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <Logo className="h-7 w-7 text-brand-600" />
          <span>Plazo</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/messages" className="btn-secondary hidden sm:inline-flex">
                Messages
              </Link>
              <Link href="/my-listings" className="btn-secondary hidden sm:inline-flex">
                My listings
              </Link>
              <Link href="/listings/new" className="btn-primary">
                + Post ad
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Log in
              </Link>
              <Link href="/signup" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </StickyHeader>
  );
}
