# Contact form email with Resend (production-ready)

GoDaddy Microsoft 365 often blocks SMTP for apps. This project sends contact notifications via **Resend** when `RESEND_API_KEY` is set.

## What you need

| Variable | Example | Purpose |
|----------|---------|---------|
| `RESEND_API_KEY` | `re_...` | From [Resend → API Keys](https://resend.com/api-keys) |
| `EMAIL_FROM` | `TIJARA <info@tijara.dev>` | **From** address (must use a verified domain) |
| `CONTACT_NOTIFICATION_EMAIL` | `info@tijara.dev` | **To** — inbox that receives form alerts |

Optional: keep SMTP vars empty when using Resend.

## Part 1 — Resend account

1. Sign up at [https://resend.com](https://resend.com)
2. **API Keys** → **Create API Key** → copy it (starts with `re_`)
3. Add to `.env.local` (local) and your host env (production):

```env
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=TIJARA <info@tijara.dev>
CONTACT_NOTIFICATION_EMAIL=info@tijara.dev
```

Restart the dev server after changing env vars.

## Part 2 — Verify `tijara.dev` in Resend

1. Resend dashboard → **Domains** → **Add Domain**
2. Enter `tijara.dev`
3. Resend shows DNS records (SPF, DKIM, etc.)

## Part 3 — Add DNS in GoDaddy

1. Go to [GoDaddy DNS](https://dcc.godaddy.com/) for **tijara.dev**
2. **DNS** → **Manage DNS**
3. For each record Resend shows, click **Add** and match exactly:

| Type | Name / Host | Value |
|------|-------------|--------|
| TXT | (as Resend shows, often `@` or `send`) | SPF / verification string |
| CNAME | (as Resend shows) | Resend target host |

4. Save each record
5. Back in Resend → **Verify** on the domain
6. Wait 5–60 minutes if verification is pending (DNS propagation)

Until the domain is **Verified**, production sends from `info@tijara.dev` will fail.

### Testing before DNS is verified

Resend allows sending from `onboarding@resend.dev` only to **your own** signup email for quick tests:

```env
EMAIL_FROM=onboarding@resend.dev
CONTACT_NOTIFICATION_EMAIL=your-resend-account-email@gmail.com
```

Switch to `info@tijara.dev` after domain verification.

## Part 4 — Local test

1. `npm run dev`
2. Submit the contact form on `/contact`
3. Check `CONTACT_NOTIFICATION_EMAIL` inbox (and spam)
4. Terminal should **not** show `[API Contact] Email notification failed`
5. Submission should appear in **Admin → Messages**

## Part 5 — Production (Vercel, VPS, etc.)

Set the **same** variables on your host. Example for Vercel:

1. Project → **Settings** → **Environment Variables**
2. Add for **Production** (and Preview if you want):

   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `CONTACT_NOTIFICATION_EMAIL`
   - `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL=https://tijara.dev`, etc.

3. Redeploy after saving env vars
4. Test the live `/contact` form

`AUTH_URL` and `NEXT_PUBLIC_SITE_URL` must match your live URL in production.

## How the app chooses a provider

1. If `RESEND_API_KEY` is set → **Resend API** (recommended)
2. Else if SMTP vars are set → Nodemailer SMTP
3. Else → email skipped (form still saves to database)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Domain not verified | Finish GoDaddy DNS; wait for propagation |
| 403 / validation error on send | `EMAIL_FROM` must use verified domain |
| No email but form succeeds | Check server logs; verify `RESEND_API_KEY` on production host |
| Wrong inbox | Set `CONTACT_NOTIFICATION_EMAIL` to the mailbox you check |

## Security

- Never commit `.env.local` or API keys to git
- Rotate the Resend API key if it was exposed
