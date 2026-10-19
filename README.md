# Department of Pharmacy Website

Next.js 14 + Tailwind CSS + Supabase (login, database, PDF storage), hosted on Vercel.

## Roles
| Role | What they can do |
|------|------------------|
| Student | View notices, download lecture notes of their own programme, view the alumni registry |
| Uploader (CR / faculty) | Post notices and upload PDF notes for their own programme |
| Alumni | Everything a student can, plus a profile in the Alumni Registry |
| Admin | Everything, plus: give roles to users, manage the gallery |

## Setup
1. Create a Supabase project, then run `supabase/schema.sql` in the SQL Editor.
2. In Vercel, add environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`), then redeploy.
3. Sign up on the website, then run the "make yourself admin" SQL at the bottom of `schema.sql`.

## Editing text without a developer
- Department name, contact details, programmes and faculty list: `data/site.ts`
- Notices, notes, alumni, gallery and user roles: from the website itself (Upload and Admin pages)
