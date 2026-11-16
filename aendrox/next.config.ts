import type { NextConfig } from 'next';

const config: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Images, videos and models: let browsers keep them for a day and
        // serve the cached copy while refreshing in the background for a week.
        source: '/assets/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
};

export default config;
