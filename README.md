# Plazo — Classifieds App

A general-purpose classifieds web app (Craigslist-style): browse/search listings by
category, post ads with photos, and message sellers directly. Built with Next.js
(App Router) and Supabase (Postgres + Auth + Storage + Realtime).

## What's included

- **Browse & search** — home page with category pills, keyword/price/location filters
- **Auth** — email/password sign up & login (Supabase Auth, cookie-based sessions)
- **Post/edit/delete listings** — with multi-photo upload to Supabase Storage
- **My listings** dashboard
- **Messaging** — per-listing conversations with realtime updates (Supabase Realtime)
- **Row Level Security** on every table — users can only edit their own data,
  conversations/messages are private to their participants

## Backend

A live Supabase project was created for this app:

- Project: `classifieds-app` (id `aidxqferzdqweylngkbc`, region `us-east-1`)
- Tables: `profiles`, `categories`, `listings`, `listing_images`, `conversations`, `messages`
- Storage bucket: `listing-images` (public)
- Security advisor: **0 open findings** (checked via Supabase's linter after hardening
  RLS policies and function permissions)

`.env.local` is already filled in with this project's URL and anon key, so the app
works out of the box.

## Running it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Email confirmation

New signups go through Supabase's default email confirmation flow. Supabase's
built-in email service is rate-limited and intended for testing — for real use,
configure a custom SMTP provider in the Supabase dashboard (Authentication → Settings).

## Notes / things to decide before going live

- **Categories** are seeded with general-purpose classifieds categories (For Sale,
  Vehicles, Housing, Jobs, Services, Electronics, Community, Free Stuff, Meetup,
  Charity & Events). Edit the `categories` table in Supabase to change these.
- **Moderation**: there's no admin/reporting layer yet — worth adding before opening
  this to the public.
- **Deployment**: this is a standard Next.js app — deploys cleanly to Vercel or any
  Node host. Set the same two env vars (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) wherever you host it, and add that host's URL to
  Supabase's Auth → URL Configuration (Site URL / Redirect URLs).
- **Billing**: the Supabase project runs on your org's Pro plan (~$10/mo), since the
  org had no free-tier project slot available.

## Project structure

```
src/
  app/                  routes (App Router)
  components/           shared UI + client-side forms
  lib/supabase/         browser/server/middleware Supabase clients
  lib/database.types.ts generated Postgres types
  lib/format.ts         price/date formatting helpers
```
