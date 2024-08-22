import {
  RawCode,
  Pre,
  highlight,
  AnnotationHandler,
  InnerLine,
  BlockAnnotation,
} from "codehike/code"
import Content from "./content.md"

export default function Page() {
  return <Content components={{ Code }} />
}

const diff: AnnotationHandler = {
  name: "diff",
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => {
    const color = annotation.query == "-" ? "#f85149" : "#3fb950"
    return [
      annotation,
      {
        ...annotation,
        name: "mark",
        query: color,
      },
    ]
  },
  Line: ({ annotation, ...props }) => {
    return (
      <>
        <div className="min-w-[1ch] box-content opacity-70 pl-2 select-none">
          {annotation?.query}
        </div>
        <InnerLine merge={props} />
      </>
    )
  },
}

const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = annotation?.query || "rgb(14 165 233)"
    return (
      <div
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `rgb(from ${color} r g b / 0.2)`,
        }}
        className="flex"
      >
        <InnerLine merge={props} className="px-2 flex-1" />
      </div>
    )
  },
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <Pre
      className="m-0 px-0 bg-zinc-950/90"
      code={highlighted}
      handlers={[mark, diff]}
    />
  )
}
