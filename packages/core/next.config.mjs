import createMDX from "@next/mdx"
import { myPlugin } from "./src/remark/remark.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {}

const withMDX = createMDX({
  options: {
    extension: /\.mdx?$/,
    remarkPlugins: [myPlugin],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
