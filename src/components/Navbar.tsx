import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import Logo from "@/components/Logo";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] border-b border-gray-200 bg-white [-webkit-transform:translate3d(0,0,0)] [transform:translate3d(0,0,0)] [will-change:transform]"
    >
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
    </header>
  );
}
