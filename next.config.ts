import type { NextConfig } from 'next';
import dns from 'dns';

// Fix Node.js SRV resolution for MongoDB Atlas across local environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
