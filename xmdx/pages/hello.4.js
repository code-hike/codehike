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
  const kids = React.Children.toArray(children)
  const h1s = kids
    .filter(child => child.props.mdxType === "h1")
    .map(child => child.props.children)

  return (
    <main>
      Table of contents:
      <ul>
        {h1s.map(h => (
          <li>{h}</li>
        ))}
      </ul>
      <hr />
      {children}
    </main>
  )
}
