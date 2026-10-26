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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Jèrè custom domain

`www.jèrè.com` has the DNS hostname `www.xn--jr-7iab.com`. Both the apex and
`www` belong to the existing `solfligh-tech` Vercel project. The proxy serves
the Jèrè landing page at the branded root, redirects the apex to `www`, and
publishes a separate robots.txt and sitemap.xml for that domain. Company pages
and insights remain on `www.solflightech.org`.

Activation is intentionally staged:

1. Keep `NEXT_PUBLIC_JERE_DOMAIN_ENABLED` unset while connecting DNS and HTTPS.
   The original product URL continues to serve normally and remains canonical.
2. Deploy the host routing and verify the branded root, screenshots, signup,
   robots.txt and sitemap.xml over HTTPS.
3. Set `NEXT_PUBLIC_JERE_DOMAIN_ENABLED=true` in the Vercel production
   environment and rebuild/redeploy. It is a build-time public setting used by
   both server and client links.
4. Verify the old product URL returns 308 to the branded root, the branded root
   returns 200, and its canonical and SoftwareApplication URL use the new origin.
   The corporate sitemap then excludes the moved page; the new domain's sitemap
   lists its root. Submit that sitemap in Google Search Console.

To roll back, remove the flag and redeploy. Keep the branded host serving its
landing page because browsers may retain previously issued permanent redirects.
The database slug, media paths and insights URLs remain `profitpilot`.
