"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { logEvent } from "@/lib/analytics";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "");

  if (!username.trim()) {
    redirect(`/signup?error=${encodeURIComponent("Username is required.")}`);
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username.trim())
    .maybeSingle();

  if (existingProfile) {
    redirect(
      `/signup?error=${encodeURIComponent("That username is already taken. Please choose another.")}`
    );
  }

  // Build the site's own origin so the confirmation email links back here
  // instead of relying on Supabase's (often stale) Site URL setting.
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  await logEvent(supabase, "signup", { userId: data.user?.id ?? null });

  // If email confirmations are turned off in Supabase, signUp() returns an
  // active session right away and no email is sent — send the user straight
  // in instead of telling them to check an email that won't arrive.
  if (data.session) {
    redirect("/");
  }

  redirect("/login?error=" + encodeURIComponent("Account created. Check your email to confirm, then log in."));
}
