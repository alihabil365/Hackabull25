/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "supabase.co",
      "unkrwmufmqfklqfwuubz.supabase.co", // Replace with your Supabase project URL
    ],
  },
};

module.exports = nextConfig;
