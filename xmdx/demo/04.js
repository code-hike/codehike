import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/hello.md"
import { ShowChildrenJSON } from "../src/children-as-json"

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  )
}

const components = {
  wrapper: Wrapper,
}

function Wrapper({ children }) {
  return <ShowChildrenJSON children={children} />
}
