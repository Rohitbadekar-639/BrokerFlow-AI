# BrokerFlow AI

BrokerFlow AI is a real production micro-SaaS for Indian real estate brokers to stop lead leakage using an AI WhatsApp Receptionist Automation.

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS with Shadcn-style UI components
- Clerk (production auth + hosted signup/signin; password hashing handled by Clerk)
- Supabase (PostgreSQL)
- Groq SDK (Llama-3 model)
- Razorpay (real INR payment collection)
- Twilio/Meta WhatsApp provider adapters

## Production Features Included

- Conversion-focused landing page with legal footer pages
- Clerk auth userflow (`/sign-up`, `/sign-in`) for real users
- Tenant-safe Supabase schema with row-level security policies
- AI lead qualification + WhatsApp response adapter architecture
- Dashboard KPI cards + Recharts pipeline chart + lead detail modal
- Razorpay order creation + signature verification + webhook endpoint

## Core Flows

- Landing page: `/`
- Sign-in page: `/sign-in`
- Sign-up page: `/sign-up`
- Dashboard: `/dashboard`
- Lead webhook (99acres/MagicBricks mock): `POST /api/webhook/lead`
- AI qualification endpoint: `POST /api/ai/reply`
- Razorpay create order: `POST /api/payments/create-order`
- Razorpay verify payment: `POST /api/payments/verify`
- Razorpay webhook: `POST /api/payments/webhook`

## Sample Webhook Payload

```json
{
  "brokerClerkUserId": "user_2xABC...",
  "source": "99acres",
  "mobile": "919876543210",
  "emailBody": "Hi, my name is Rohan. Looking for 2BHK in Whitefield Bangalore. Budget 90L."
}
```

## Setup Checklist (Step-by-Step)

1. Install dependencies
   - `npm install`
2. Environment setup
   - Copy `.env.example` to `.env.local`
3. Supabase schema + RLS
   - Run `db/schema.sql` in Supabase SQL editor
4. Start app
   - `npm run dev`
5. Create first account
   - Visit `/sign-up` and create first broker user
   - Dashboard access confirms Clerk + DB sync is working

## How To Get Real API Keys

### 1) Clerk (Auth)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create/select your application
3. Enable Email + Google auth (optional)
4. Copy and set:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2) Supabase (Database)

1. Go to [Supabase](https://supabase.com/dashboard)
2. Create project
3. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Execute `db/schema.sql`

### 3) Groq (AI)

1. Go to [Groq Console](https://console.groq.com/keys)
2. Create API key
3. Set `GROQ_API_KEY`

### 4) Twilio WhatsApp (Option A)

1. Go to [Twilio Console](https://console.twilio.com/)
2. Activate WhatsApp sandbox or approved WABA sender
3. Copy:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_FROM`
4. Set `settings.whatsapp_provider = 'twilio'` for your broker row

### 5) Meta WhatsApp Cloud API (Option B)

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create app + WhatsApp product
3. Get:
   - `META_WABA_ACCESS_TOKEN`
   - `META_WABA_PHONE_NUMBER_ID`
4. Set `settings.whatsapp_provider = 'meta'`

### 6) Razorpay (Payments)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Generate API keys in live mode
3. Add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Configure webhook endpoint:
   - `https://<your-domain>/api/payments/webhook`
5. Set webhook secret as:
   - `RAZORPAY_WEBHOOK_SECRET`

## Deploy (Vercel Recommended)

### Vercel

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add all env vars from `.env.example`.
4. Deploy.
5. Update Clerk allowed origins and redirect URLs with your production domain.
6. Add production domain in Razorpay app settings.

### Netlify

1. Push this repo to GitHub.
2. Import project in Netlify with Next.js runtime.
3. Add environment variables.
4. Deploy.

## Compliance Pages Included

- `/terms`
- `/privacy`
- `/refund-policy`
- `/contact`

## Recommended Next Hardening (Post Launch)

- Add webhook retry queue (QStash/Upstash or Supabase queue worker)
- Add GST invoice generation + email receipts
- Add role-based sub-users and activity audit logs
- Add CRM export and SLA monitoring alerts
