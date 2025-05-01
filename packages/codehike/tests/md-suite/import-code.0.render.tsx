import { MDXContent } from "mdx/types"
import { AnnotationHandler, highlight, Pre, RawCode } from "../../src/code"
import React from "react"

export function render(Content: MDXContent) {
  // @ts-ignore
  return <Content components={{ MyCode }} />
}

async function MyCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return <Pre code={highlighted} handlers={[mark]} />
}

const mark: AnnotationHandler = {
  name: "mark",
  Pre: ({ _stack, ...props }) => <section {...props} />,
  Block: ({ children, annotation }) => (
    <mark className={annotation.query}>{children}</mark>
  ),
}
