import { withContentlayer } from "next-contentlayer"
import createNextIntlPlugin from "next-intl/plugin"
import "./env.mjs"

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
    serverActions: true,
  },
}

export default withContentlayer(withNextIntl(nextConfig))
