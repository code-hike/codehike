import { MDXContent } from "mdx/types"
import {
  AnnotationHandler,
  highlight,
  InnerToken,
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
  return <Pre code={highlighted} handlers={[fold]} />
}

const fold: AnnotationHandler = {
  name: "fold",
  Pre: ({ children }) => <div>{children}</div>,
  Token: ({ annotation, ...props }) => (
    <span className={annotation?.query || "base"}>
      <InnerToken merge={props} />
    </span>
  ),
}
