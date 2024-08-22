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
      className="m-0 bg-zinc-950"
      code={highlighted}
      handlers={[borderHandler, bgHandler]}
    />
  )
}
const borderHandler: AnnotationHandler = {
  name: "border",
  Block: ({ annotation, children }) => {
    const borderColor = annotation.query || "red"
    return <div style={{ border: "1px solid", borderColor }}>{children}</div>
  },
}

const bgHandler: AnnotationHandler = {
  name: "bg",
  Inline: ({ annotation, children }) => {
    const background = annotation.query || "#2d26"
    return <span style={{ background }}>{children}</span>
  },
}
