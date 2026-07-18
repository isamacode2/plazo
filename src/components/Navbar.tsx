import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";
import Logo from "@/components/Logo";
import StickyHeader from "@/components/StickyHeader";
import MobileNavMenu from "@/components/MobileNavMenu";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let unreadCount = 0;
  if (user) {
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null)
      .neq("sender_id", user.id);
    unreadCount = count ?? 0;
  }

  return (
    <StickyHeader>
      <div className="container-px flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <Logo className="h-7 w-7 text-brand-600" />
          <span>Plazo</span>
        </Link>

        {/* Desktop/tablet: full row of actions, sm breakpoint and up only. */}
        <nav className="hidden items-center gap-3 sm:flex">
          {user ? (
            <>
              <Link href="/messages" className="btn-secondary relative">
                Messages
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/my-listings" className="btn-secondary">
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

        {/* Mobile: a single menu button that can never overflow the screen. */}
        <MobileNavMenu isLoggedIn={!!user} unreadCount={unreadCount} />
      </div>
    </StickyHeader>
  );
}
