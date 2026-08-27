This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Cookie Consent Banner

Cvoop displays a cookie consent banner for visitors from European Union countries.

The banner obtains consent before loading Google Analytics. Google Analytics scripts are not loaded until the visitor explicitly accepts analytics cookies.

### How it works

- The visitor's country is detected using the `CF-IPCountry` header provided by Cloudflare.
- The banner is displayed only for visitors from EU member states.
- The consent choice is stored in `localStorage` under `cvoop_analytics_consent`.
- The accepted values are `accepted` and `rejected`.
- Google Analytics is loaded only when the stored consent is `accepted`.
- For visitors outside the EU, Google Analytics may load without displaying the banner.
- If the visitor's country cannot be determined, Google Analytics remains disabled until consent is given.
- Visitors who decline analytics are not tracked by Google Analytics.

### Local testing

To display the banner manually during local development, add `cookie_banner=1` to the URL:

```text
http://localhost:3000/?cookie_banner=1
```

This allows the banner to be tested even when the local environment does not provide a country header.

### Relevant files

- `apps/web/src/components/analytics/CookieBanner.tsx`
- `apps/web/src/components/analytics/GoogleAnalytics.tsx`
- `apps/web/src/app/api/location/route.ts`

### Configuration

Google Analytics is enabled only when this environment variable is configured:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

If `NEXT_PUBLIC_GA_ID` is not set, Google Analytics and the cookie consent functionality remain inactive.
