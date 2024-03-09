import { CH } from "@code-hike/mdx/components"

declare global {
  interface MDXProvidedComponents {
    CH: typeof CH
  }
}

export {}
