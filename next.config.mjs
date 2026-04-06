/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/civitas26',
        destination: '/civitas26/index.html',
      },
    ];
  },
};

export default nextConfig;
