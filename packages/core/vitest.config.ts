import { defineConfig } from "vitest/config"
// import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  test: {
    environment: "jsdom",
  },
})
