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
  return <ShowChildrenObjectJSON children={children} />
}

function ShowChildrenObjectJSON({ children }) {
  console.log(children)
  const parse = c => {
    if (!c.props) {
      return c
    }
    return {
      props: {
        mdxType: c.props.mdxType,
        children:
          c.props.children &&
          !Array.isArray(c.props.children)
            ? parse(c.props.children)
            : React.Children.map(c.props.children, parse),
      },
    }
  }
  const o = React.Children.map(children, parse)

  return <pre>{JSON.stringify(o, null, 2)}</pre>
}
