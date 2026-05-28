import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

// const basePath = isProd ? '/breakingtheice' : '';
const basePath = isProd ? '' : '';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },

  reactStrictMode: !isProd ? false : true,

  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
