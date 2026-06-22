This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
AgriVault
├─ eslint.config.mjs
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
├─ README.md
└─ src
   ├─ app
   │  ├─ api
   │  │  ├─ auth
   │  │  │  ├─ login
   │  │  │  │  └─ route.js
   │  │  │  └─ register
   │  │  │     └─ route.js
   │  │  ├─ catalog
   │  │  │  └─ route.js
   │  │  ├─ products
   │  │  │  ├─ route.js
   │  │  │  └─ [id]
   │  │  │     └─ route.js
   │  │  ├─ requests
   │  │  │  ├─ route.js
   │  │  │  └─ [id]
   │  │  │     └─ route.js
   │  │  ├─ test-db
   │  │  │  └─ route.js
   │  │  └─ transactions
   │  │     ├─ history
   │  │     │  └─ route.js
   │  │     └─ route.js
   │  ├─ globals.css
   │  ├─ layout.jsx
   │  └─ page.jsx
   ├─ components
   ├─ context
   ├─ hooks
   ├─ lib
   │  └─ db.js
   ├─ models
   │  ├─ Product.js
   │  ├─ Request.js
   │  ├─ Transaction.js
   │  └─ User.js
   └─ services

```