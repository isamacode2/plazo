"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const supabase = createClient();

  return (
    <button
      className={className ?? "btn-secondary px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"}
      onClick={async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
