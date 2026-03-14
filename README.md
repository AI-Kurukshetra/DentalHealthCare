# Dental Practice Management System (Next.js + Supabase)

Modern, clean marketing site with Supabase-backed appointment booking and blog CMS. Built with Next.js App Router, GSAP animations, and a dental professional palette.

## Tech
- Next.js (App Router)
- Supabase (PostgreSQL, Auth-ready, Storage-ready, Realtime)
- GSAP for animations
- Hind font

## Setup
1. Install dependencies.
2. Create a Supabase project.
3. Run the SQL in `supabase/schema.sql` in Supabase SQL editor.
4. Copy `.env.example` to `.env.local` and fill values.
5. Start dev server.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional for server-side reads)

## Supabase Tables
- `appointments` (used by appointment form)
- `posts` (blog CMS)

## Notes
- Appointments insert uses RLS policy `Allow insert appointments`.
- Blog posts are fetched server-side and updated in realtime.
- Replace SVG placeholders in `public/images` with real dental photography.
