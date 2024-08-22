import { AnnotationHandler, BlockAnnotation, InnerLine } from "codehike/code"

export const mark: AnnotationHandler = {
  name: "mark",
  Line: ({ annotation, ...props }) => {
    const color = getColor(annotation)
    return (
      <div
        style={{
          borderLeft: "solid 2px transparent",
          borderLeftColor: annotation && color,
          backgroundColor: annotation && `rgb(from ${color} r g b / 0.13)`,
        }}
        className="flex"
      >
        <InnerLine merge={props} className="px-2 flex-1" />
      </div>
    )
  },
  Inline: ({ annotation, children }) => {
    const color = getColor(annotation)
    return (
      <span
        style={{
          outline: `solid 1px rgb(from ${color} r g b / 0.5)`,
          backgroundColor: `rgb(from ${color} r g b / 0.13)`,
        }}
        className="rounded px-0.5 py-0 -mx-0.5"
      >
        {children}
      </span>
    )
  },
}

function getColor(annotation?: { query?: string }) {
  const n = Number(annotation?.query || "2") % colors.length
  return colors[n] || annotation?.query
}

const colors = [
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
]
