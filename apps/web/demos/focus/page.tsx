import { RawCode, highlight } from "codehike/code"
import Content from "./content.md"
import { CodeContainer } from "./code"

export default function Page() {
  return <Content components={{ Code }} />
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const info = await highlight(codeblock, "github-dark")
  return <CodeContainer code={info} />
}
