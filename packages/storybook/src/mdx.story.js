import CodeTest from "./assets/code.mdx"
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
