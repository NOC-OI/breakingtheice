import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const basePath = isProd ? '/ocean-informatics/atlantis/frontend/atlantis-vis' : '';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath,
  assetPrefix: basePath,

  reactStrictMode: !isProd ? false : true,

  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
