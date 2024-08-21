import { MDXContent } from "mdx/types"
import {
  AnnotationHandler,
  highlight,
  InnerPre,
  Pre,
  RawCode,
} from "../../src/code"
import React from "react"

export function render(Content: MDXContent) {
  // @ts-ignore
  return <Content components={{ MyCode }} />
}

async function MyCode({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return <Pre code={highlighted} className="foo" handlers={[mark]} />
}

const mark: AnnotationHandler = {
  name: "mark",
  Pre: (props) => <InnerPre merge={props} data-mark={true} className="mark" />,
  Block: ({ children }) => <mark>{children}</mark>,
}
