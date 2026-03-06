import { withPlaiceholder } from '@plaiceholder/next';
import nextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
};

export default withPlaiceholder(nextConfig);