import React from "react"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/hello.md"

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
  // Get the titles from all the H1s
  const titles = React.Children.toArray(children)
    .filter(child => child.props.mdxType === "h1")
    .map(child => child.props.children)

  return (
    <main>
      Table of contents:
      <ul>
        {titles.map(title => (
          <li>{title}</li>
        ))}
      </ul>
      <hr />
      {children}
    </main>
  )
}
