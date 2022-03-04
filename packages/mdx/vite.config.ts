import path from "path"
import { defineConfig } from "vite"

/* eslint-disable spaced-comment */
/// <reference types="vitest" />
/// <reference types="vitest/globals" />

// see https://github.com/vuejs/petite-vue/blob/main/vite.config.ts
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "ch-core",
      formats: ["es"],
      // fileName: (format: string) => `ch-core.${format}.js`,
    },
    rollupOptions: {
      // https://github.com/vitejs/vite/discussions/1736#discussioncomment-413068
      input: {
        plugin: path.resolve(__dirname, "src/index.tsx"),
        components: path.resolve(
          __dirname,
          "src/components.tsx"
        ),
        styles: path.resolve(__dirname, "src/index.scss"),
      },
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom"],
      output: {
        entryFileNames: "[name].[format].js",
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})
