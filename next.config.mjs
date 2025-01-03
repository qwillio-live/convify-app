import { withContentlayer } from "next-contentlayer"
import createNextIntlPlugin from "next-intl/plugin"

import "./env.mjs"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "s3.eu-central-2.wasabisys.com",
      "s3.ap-southeast-1.wasabisys.com",
      "siteimages.b-cdn.net",
      "img-uploads.b-cdn.net",
    ],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/upload",
        destination: `${process.env.NEXT_PUBLIC_UPLOADER_URL}/upload`,
      },
    ]
  },
  webpack: (config) => {
    // Ignore source map files
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    })

    return config
  },
}

export default withContentlayer(withNextIntl(nextConfig))
