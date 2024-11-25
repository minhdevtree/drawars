/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FRONTEND_SITE_NAME: process.env.FRONTEND_SITE_NAME || 'Drawars',
  },
};

export default nextConfig;
