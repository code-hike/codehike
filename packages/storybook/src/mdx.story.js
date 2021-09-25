import CodeTest from "./assets/code.mdx"
import CodeWithLinks from "./assets/code-with-links.mdx"
import React from "react"
import { Page } from "./utils"
export default {
  title: "Test/MDX",
}

export function basic() {
  return (
    <Page style={{ maxWidth: 800 }}>
      <CodeTest />
    </Page>
  )
}

export function withLinks() {
  return (
    <Page style={{ maxWidth: 800 }}>
      <CodeWithLinks />
    </Page>
  )
}
