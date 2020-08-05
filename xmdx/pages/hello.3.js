import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../docs/hello.md"

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
  return <ShowChildrenObjectJSON children={children} />
}

function ShowChildrenObjectJSON({ children }) {
  console.log(children)
  return <pre>{children}</pre>
}
