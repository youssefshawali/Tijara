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
- **MongoDB + Mongoose**
- **Cloudinary** (image uploads)
- **Recharts** (analytics)
- **Sonner** (toast notifications)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | Random secret for sessions (`openssl rand -base64 32`) |
| `AUTH_URL` | App URL (`http://localhost:3000` in dev) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial admin credentials for seeding |
| `CLOUDINARY_*` | Cloudinary credentials for media uploads |

### 3. Seed the database

```bash
npm run seed
```

This creates the admin user, sample services, testimonials, blog post, and contact submissions.

### 4. Run the dev server

```bash
npm run dev
```

- **Website:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Admin Dashboard

The client can manage everything without coding:

| Section | Features |
|---------|----------|
| **Dashboard** | Stats, activity chart, recent messages, quick actions |
| **Services** | Add, edit, delete services with images |
| **Blog Posts** | Create/edit posts, draft/publish, SEO fields |
| **Testimonials** | Manage client quotes and ratings |
| **Messages** | View contact form submissions, mark read/unread, search |
| **Media Library** | Upload images via Cloudinary, copy URLs |
| **Settings** | Company info, contact details, social links, SEO, logo |

## Project Structure

```
/app
  /(website)        → Public marketing pages
  /admin            → Admin dashboard (protected)
  /api              → API routes (contact, admin CRUD)
/components
  /admin            → Dashboard UI components
  /layout           → Public site layout
  /sections         → Page sections
  /ui               → Shadcn UI components
/models             → MongoDB/Mongoose schemas
/lib                → Utilities, auth, validations
/scripts            → Database seed script
```

## Public Pages

- `/` — Home
- `/about` — About
- `/services` — Services
- `/contact` — Contact form (saves to MongoDB)

## Deployment

```bash
npm run build
npm start
```

Set all environment variables in your hosting provider (Vercel, etc.). Point `tijara.dev` to your host.

## Security

- Admin routes protected by NextAuth middleware
- Passwords hashed with bcrypt
- API routes require authenticated session
- Contact form rate limiting (5 requests/minute per IP)
- Zod validation on all inputs
