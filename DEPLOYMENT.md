# Deployment and Buyer Funnel Setup

## 1. Deploy on Vercel

1. Push this project to GitHub.
2. In Vercel, create a new project from the GitHub repo.
3. Use the default Next.js settings.
4. Add your custom domain.
5. Set these environment variables in Vercel:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
NEXT_PUBLIC_BOOKING_URL=https://your-booking-link
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=Riviera Nayarit Quiz <leads@your-domain.com>
LEAD_NOTIFY_EMAIL=you@your-domain.com
LEAD_WEBHOOK_URL=https://your-crm-webhook-url
LEAD_WEBHOOK_SECRET=optional-shared-secret
```

## 2. Lead Capture

The quiz posts leads to `/api/leads`.

If `RESEND_API_KEY` is set, the app emails every lead through Resend. By default, leads go to `jim@dreambiginmexico.com`; set `LEAD_NOTIFY_EMAIL` to override that.

Use a verified Resend sender in `RESEND_FROM_EMAIL`. For early testing, Resend's onboarding sender may work only with the email attached to your Resend account.

If `LEAD_WEBHOOK_URL` is set, the app forwards the lead to your CRM, Zapier, Make, GoHighLevel, HubSpot, or another webhook receiver.

If both Resend and `LEAD_WEBHOOK_URL` are missing, the lead is only logged by the server. That is fine for testing, but not for production.

## 3. Tracking

The app supports:

- Google Analytics 4 with `NEXT_PUBLIC_GA_ID`
- Google Tag Manager with `NEXT_PUBLIC_GTM_ID`
- Meta Pixel with `NEXT_PUBLIC_META_PIXEL_ID`

Tracked events:

- `quiz_completed`
- `lead_submitted`

## 4. SEO Pages Added

- `/buyers-canada-us`
- `/compare-bucerias-la-cruz-nuevo-nayarit`
- `/retire-in-riviera-nayarit`

Use these pages in Google Ads, Meta Ads, YouTube descriptions, blog posts, and email follow-ups.

## 5. Ad Angles

Google Search:

- Riviera Nayarit real estate
- Bucerias real estate
- Nuevo Nayarit condos for sale
- buy property in Mexico
- retire in Riviera Nayarit
- Mexico vacation home

Meta:

- "Not sure where in Riviera Nayarit fits you?"
- "Bucerias, La Cruz, Nuevo Nayarit, or Punta Mita?"
- "Take the 2-minute Riviera Nayarit buyer match quiz."

## 6. Production Checklist

- Set `NEXT_PUBLIC_BOOKING_URL` if you use Calendly, GoHighLevel, or another scheduler. Without it, the app uses the built-in `/book` request form.
- Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEAD_NOTIFY_EMAIL`.
- Connect `LEAD_WEBHOOK_URL`.
- Add tracking IDs.
- Add your domain in Vercel.
- Test the quiz on mobile.
- Submit the domain to Google Search Console.
