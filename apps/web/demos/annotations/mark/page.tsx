import Content from "./content.md"
import { RawCode, Pre, highlight, InnerLine } from "codehike/code"
import { AnnotationHandler } from "codehike/code"

export default function Page() {
  return <Content components={{ Code }} />
}

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <Pre
      className="m-0 px-0 bg-zinc-950"
      code={highlighted}
      handlers={[mark]}
    />
  )
}
const mark: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine merge={props} data-mark={true} />
  ),
  Line: (props) => (
    <InnerLine
      merge={props}
      className="px-2 border-l-4 border-transparent data-[mark]:border-blue-400"
    />
  ),
}
