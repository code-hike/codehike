import { Pre, RawCode, highlight } from "codehike/code"
import Content from "./content.md"
import { CopyButton } from "./button"

export default function Page() {
  return <Content components={{ Code }} />
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")

  return (
    <div className="relative">
      <CopyButton text={highlighted.code} />
      <Pre className="m-0 px-4 bg-zinc-950/80" code={highlighted} />
    </div>
  )
}
