# cadence.

### Event ticketing for independent organizers

Cadence is a focused event and ticketing SaaS for workshop hosts, meetup runners, and small conference or party organizers who need a real event page and reliable tickets without Eventbrite fees or custom development.

## Why cadence.

Many independent organizers still sell tickets through bank transfers and WhatsApp lists. Cadence gives them a simple public event page, Paystack checkout, signed QR tickets, attendee management, and a sales dashboard in one place.

## Core workflows

### Organizer

- Create an organization profile with a logo
- Create and publish events with physical or online venues
- Add ticket tiers such as Early Bird, VIP, and General
- Set inventory caps and optional sales windows
- Share a public event URL
- Track tickets sold, revenue, and attendees
- Check attendees in with a browser-based QR scanner
- Connect Google Calendar for one-way event sync

### Attendee

- View a public event page without an account
- Choose a ticket tier and pay securely with Paystack
- Receive a confirmation email with a signed QR ticket
- Present the ticket at the door for check-in

## Project structure

```text
cadence/
├── api/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
└── app/                 # Next.js frontend
```

## Backend setup

Requirements: Node.js 20+, MongoDB, and a Paystack account. Google Calendar sync additionally requires a Google Cloud OAuth 2.0 web client.

```bash
cd api
npm install
Copy-Item .env.example .env   # PowerShell
npm run dev
```

The API runs on `http://localhost:4000` by default. For a production build:

```bash
npm run build
npm start
```

Set the values in `api/.env` before using external integrations:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signing secret for organizer sessions and QR tokens |
| `PAYSTACK_SECRET_KEY` | Paystack API authentication |
| `PAYSTACK_WEBHOOK_SECRET` | Paystack webhook HMAC secret |
| `RESEND_API_KEY` | Transactional confirmation email delivery |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | OAuth callback, for example `http://localhost:4000/auth/google/callback` |
| `FRONTEND_DASHBOARD_URL` | Redirect target after Google connects |
| `PORT` | API port, defaults to `4000` |

## API routes

### Authentication

| Method | Route | Auth |
| --- | --- | --- |
| `POST` | `/auth/signup` | Public |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/google/connect` | Organizer JWT |
| `GET` | `/auth/google/callback` | Google OAuth |
| `POST` | `/auth/google/disconnect` | Organizer JWT |

### Events and tickets

| Method | Route | Auth |
| --- | --- | --- |
| `POST` | `/events` | Organizer JWT |
| `PATCH` | `/events/:id` | Organizer JWT |
| `DELETE` | `/events/:id` | Organizer JWT |
| `GET` | `/events/:slug` | Public |
| `POST` | `/events/:id/tiers` | Organizer JWT |
| `GET` | `/events/:id/tiers` | Public |
| `GET` | `/events/:id/dashboard` | Organizer JWT |
| `POST` | `/tickets/purchase` | Public |
| `GET` | `/tickets/:qrToken` | Public |
| `PATCH` | `/tickets/:qrToken/checkin` | Organizer JWT |
| `POST` | `/payments/paystack/webhook` | Paystack signature |

## Payment and ticket integrity

Ticket inventory is reserved with an atomic conditional update, preventing oversells under concurrent purchases. A ticket is created only after a verified `charge.success` Paystack webhook. Client redirects are never treated as payment confirmation. QR values are signed JWTs and do not expose sequential database IDs.

## Google Calendar sync

Google Calendar is organizer-only and one-way: Cadence creates, updates, or deletes the organizer's primary calendar event after the Cadence event write succeeds. Expired access tokens are refreshed with the stored refresh token. Google API failures are logged and deliberately do not block event creation or editing.

## Scope

Cadence intentionally does not include recurring events, multi-organizer marketplaces, seat-specific seating, automated refunds, public calendar discovery, two-way calendar sync, or mobile-native clients.

## License

This project is currently a standalone product build. Add a license before distributing it publicly.
