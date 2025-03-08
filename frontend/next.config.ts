import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: (!!process && process.env.NODE_ENV === "development") ? 'http://localhost:8000/:path*' : `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  }
};

export default nextConfig;
