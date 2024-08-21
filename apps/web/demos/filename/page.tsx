import { RawCode, Pre, highlight } from "codehike/code"
import Content from "./content.md"

export default function Page() {
  return <Content components={{ Code }} />
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <div className="px-4 bg-zinc-950/90 rounded">
      <div className="text-center text-zinc-400 text-sm py-2">
        {highlighted.meta}
      </div>
      <Pre className="m-0 px-0 pt-1 bg-transparent" code={highlighted} />
    </div>
  )
}
