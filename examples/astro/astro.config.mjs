import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import { remarkCodeHike } from "@code-hike/mdx"
import theme from "shiki/themes/github-dark.json"

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    react(),
    mdx({ remarkPlugins: [[remarkCodeHike, { autoImport: false, theme }]] }),
  ],
})
