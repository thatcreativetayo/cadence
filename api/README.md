# Cadence API

Node.js, Express, TypeScript and MongoDB backend for the Cadence event ticketing SaaS.

## Setup

1. Install Node.js 20+ and MongoDB.
2. Copy `.env.example` to `.env` and fill in the values. `PAYSTACK_WEBHOOK_SECRET` should match the signing secret configured for the webhook (Paystack commonly uses the secret key for HMAC verification).
3. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default. Production builds use `npm run build` and `npm start`.

## Routes

- `POST /auth/signup`, `POST /auth/login`
- `POST /events` (organizer JWT), `PATCH /events/:id` (organizer JWT)
- `GET /events/:slug`, `GET /events/:id/tiers`
- `POST /events/:id/tiers` (organizer JWT)
- `POST /tickets/purchase`
- `POST /payments/paystack/webhook`
- `GET /tickets/:qrToken`
- `PATCH /tickets/:qrToken/checkin` (organizer JWT)
- `GET /events/:id/dashboard` (organizer JWT)

Send organizer credentials as `Authorization: Bearer <token>`. Ticket inventory is reserved atomically during purchase with a conditional `$inc`; the Paystack webhook is the only path that creates a ticket and is idempotent on `paystackRef`. Confirmation email delivery is represented by the `RESEND_API_KEY` integration stub in `src/utils/email.ts`.
