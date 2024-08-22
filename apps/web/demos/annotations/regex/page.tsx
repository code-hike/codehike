import Content from "./content.md"
import { RawCode, Pre, highlight } from "codehike/code"
import { AnnotationHandler } from "codehike/code"

export default function Page() {
  return <Content components={{ Code }} />
}

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <Pre
      className="m-0 mb-8 bg-zinc-950"
      code={highlighted}
      handlers={[borderHandler]}
    />
  )
}
const borderHandler: AnnotationHandler = {
  name: "border",
  Inline: ({ annotation, children }) => {
    const borderColor = annotation.query || "yellow"
    return <span style={{ border: "1px solid", borderColor }}>{children}</span>
  },
}
