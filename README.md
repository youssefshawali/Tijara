# TIJARA — Business Development & Growth Consulting

Premium business development website for [tijara.dev](https://tijara.dev) with a full admin dashboard for content and lead management.

## Tech Stack

### Public Website
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Shadcn UI**
- **React Hook Form + Zod**

### Admin Dashboard
- **NextAuth** (credentials authentication)
- **PostgreSQL** (via pgAdmin 4)
- **Drizzle ORM**
- **Cloudinary** (image uploads)
- **Recharts** (analytics)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PostgreSQL in pgAdmin 4

1. Open **pgAdmin 4**
2. Create a database named `tijara` (right-click **Databases → Create → Database**)
3. Open **Query Tool** on the new database
4. Paste and run the contents of [`sql/schema.sql`](sql/schema.sql)

   Or from the terminal (after configuring `.env.local`):

   ```bash
   npm run db:push
   ```

### 3. Configure environment

Copy `.env.example` to `.env.local` and update:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `postgresql://postgres:YOUR_PASSWORD@localhost:5432/tijara` |
| `AUTH_SECRET` | Random secret (`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`) |
| `AUTH_URL` | `http://localhost:3000` in dev |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial admin login (used by seed) |
| `CLOUDINARY_*` | Optional — for media uploads |
| `RESEND_API_KEY` | Contact form email — see [docs/email-resend-setup.md](docs/email-resend-setup.md) |
| `EMAIL_FROM` | Sender address on verified domain, e.g. `TIJARA <info@tijara.dev>` |
| `CONTACT_NOTIFICATION_EMAIL` | Inbox that receives form alerts |

### 4. Seed the database

```bash
npm run seed
```

### 5. Run the dev server

```bash
npm run dev
```

- **Website:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

## Admin Dashboard

| Section | Features |
|---------|----------|
| **Dashboard** | Stats, activity chart, recent messages |
| **Services** | Add, edit, delete services |
| **Blog Posts** | Draft/publish, SEO fields |
| **Testimonials** | Client quotes and ratings |
| **Messages** | Contact form submissions |
| **Media Library** | Cloudinary image uploads |
| **Settings** | Company info, contact, social links |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run db:push` | Apply SQL schema to PostgreSQL |
| `npm run seed` | Create admin user + sample data |

## Project Structure

```
/app              → Website + admin + API routes
/lib/db           → Drizzle schema + PostgreSQL connection
/sql/schema.sql   → Tables to run in pgAdmin
/models           → (removed — use lib/db/schema.ts)
/scripts          → Seed + schema push
```

## Deployment

Set env vars on your host (Vercel, VPS, etc.), then redeploy:

- `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` (e.g. `https://tijara.dev`)
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_NOTIFICATION_EMAIL` for contact emails

Run `npm run db:push`, then `npm run seed` once on the production database.

Full email setup (Resend + GoDaddy DNS): [docs/email-resend-setup.md](docs/email-resend-setup.md).
