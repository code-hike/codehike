// using js instead of mjs because of https://github.com/contentlayerdev/contentlayer/issues/272#issuecomment-1237021441
const { withContentlayer } = require("next-contentlayer")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = withContentlayer(nextConfig)
