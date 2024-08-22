import { RawCode, highlight } from "codehike/code"
import Content from "./content.mdx"

import { Code } from "./multi-code"

export default function Page() {
  return <Content components={{ CodeSwitcher }} />
}

async function CodeSwitcher(props: { code: RawCode[] }) {
  const highlighted = await Promise.all(
    props.code.map((codeblock) => highlight(codeblock, "github-dark")),
  )
  return <Code highlighted={highlighted} />
}
