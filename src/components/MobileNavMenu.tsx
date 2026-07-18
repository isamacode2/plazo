"use client";

import { useState } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const itemClass =
  "block w-full rounded-md px-4 py-3 text-left text-base text-gray-700 hover:bg-gray-50";

export default function MobileNavMenu({
  isLoggedIn,
  unreadCount = 0,
}: {
  isLoggedIn: boolean;
  unreadCount?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    // This button is the ONLY nav element rendered below the sm breakpoint,
    // so it can never overflow the screen no matter how narrow the device is.
    <div className="relative sm:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-700"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-600" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            {isLoggedIn ? (
              <>
                <Link
                  href="/messages"
                  className={`${itemClass} flex items-center justify-between`}
                  onClick={() => setOpen(false)}
                >
                  Messages
                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link href="/my-listings" className={itemClass} onClick={() => setOpen(false)}>
                  My listings
                </Link>
                <Link href="/listings/new" className={itemClass} onClick={() => setOpen(false)}>
                  + Post ad
                </Link>
                <div className="my-1 border-t border-gray-100" />
                <SignOutButton className={itemClass} />
              </>
            ) : (
              <>
                <Link href="/login" className={itemClass} onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link href="/signup" className={itemClass} onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
