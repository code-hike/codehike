import { AnnotationHandler } from "codehike/code"

const colors = [
  "bg-green-500/20",
  "bg-teal-500/20",
  "bg-sky-500/20",
  "bg-violet-500/20",
  "bg-fuchsia-500/20",
  "bg-pink-500/20",
  // if adding more colors, dont forget to update global.css
]

// needs ruler-group class in container

export const ruler: AnnotationHandler = {
  name: "ruler",
  Block: ({ annotation, children }) => {
    const [k, c] = annotation.query?.split(" ")
    const n = Number(k || "1") % colors.length
    const bg = colors[n]
    return (
      <div className="relative" data-hover={n}>
        <div
          style={{ left: c ? "6px" : "2px" }}
          className={`absolute top-0.5 bottom-0.5 left-0.5 w-[3px] rounded-sm ${bg}`}
        />
        <div
          className={`absolute inset-0 ${bg} opacity-0 transition-opacity bg`}
        />
        <div className="relative">{children}</div>
      </div>
    )
  },
}
