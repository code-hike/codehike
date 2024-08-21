import { MDXProps } from "mdx/types.js"

type MDXContent = (props: MDXProps) => JSX.Element

export function parse(Content: MDXContent, props: MDXProps = {}) {
  return Content({ _returnBlocks: true, ...props }) as any
}
