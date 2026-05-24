# TIJARA — Business Development & Growth Consulting

Premium business development website for [tijara.dev](https://tijara.dev).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Shadcn UI** (custom components)
- **React Hook Form + Zod**
- **Lucide Icons**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/app              → Pages and API routes
/components       → Reusable UI, layout, and section components
/data             → Static content (CMS-ready)
/lib              → Utilities, services, validations, API client
/types            → TypeScript interfaces
/public/pictures  → Brand images and logo
/styles           → Global CSS
```

## Pages

- `/` — Home
- `/about` — About
- `/services` — Services
- `/contact` — Contact form

## Deployment

Deploy to Vercel, Netlify, or any Node.js host:

```bash
npm run build
npm start
```

Point your GoDaddy domain `tijara.dev` to your hosting provider.

## Future Backend

- `app/api/contact/route.ts` — Contact form API endpoint
- `lib/services/contact.service.ts` — Form submission abstraction
- `lib/api/client.ts` — Base API client

Set `NEXT_PUBLIC_API_URL` when backend is ready.

## Environment

Copy `.env.example` to `.env.local` and configure as needed.
