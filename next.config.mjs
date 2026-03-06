import { defineConfig } from 'next';

export default defineConfig({
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
  publicRuntimeConfig: {
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
  serverRuntimeConfig: {
    auth0Secret: process.env.AUTH0_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  },
  images: {
    domains: ['your-image-domain.com'],
  },
  experimental: {
    appDir: true,
  },
});