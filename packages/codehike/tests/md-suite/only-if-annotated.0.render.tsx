import { MDXContent } from "mdx/types"
import {
  AnnotationHandler,
  highlight,
  InnerLine,
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
  return <Pre code={highlighted} handlers={[mark]} />
}

const mark: AnnotationHandler = {
  name: "mark",
  onlyIfAnnotated: true,
  Line: (props) => <InnerLine merge={props} data-foo="bar" />,
}
