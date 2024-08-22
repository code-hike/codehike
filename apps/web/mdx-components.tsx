import type { MDXComponents } from "mdx/types"
import defaultComponents from "next-docs-ui/mdx/default"
import { Code, InlineCode } from "./components/code"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
    Code,
    InlineCode,
  }
}
