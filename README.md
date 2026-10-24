# Loqelo

Pre-launch landing page and waitlist for **Loqelo**, a local services marketplace connecting customers with trusted service providers.

## Features

- Bilingual site (English / Polish) with locale-based routing (`/en`, `/pl`)
- Separate waitlist sign-ups for customers and service providers
- Server-side validation and rate limiting on form submissions
- Launch countdown, product video and app screen previews
- Consent-based analytics (Google Analytics loads only after opt-in)
- Privacy policy page, sitemap, robots and SEO / Open Graph metadata
- Baseline security headers

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS
- Zod for validation
- Brevo for waitlist contact storage

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
| --- | --- |
| `BREVO_API_KEY` | Brevo API key used to store waitlist contacts |
| `BREVO_LIST_ID_CUSTOMERS` | Brevo list ID for customer sign-ups |
| `BREVO_LIST_ID_PROVIDERS` | Brevo list ID for provider sign-ups |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (defaults to `https://loqelo.com`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID (optional) |

Without the Brevo variables, sign-ups are logged locally in development so the form can still be tested.

## Scripts

- `pnpm dev` – start the development server
- `pnpm build` – create a production build
- `pnpm start` – run the production build

## Developer

Designed and developed by **Hassan Khan**.

## License

All rights reserved © Loqelo.
