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

export const pill: AnnotationHandler = {
  name: "pill",
  Inline: ({ annotation, children }) => {
    const n = Number(annotation.query || "1")
    const bg = colors[n % colors.length]
    return <span className={`${bg} p-0.5 -m-0.5 rounded`}>{children}</span>
  },
}

export function Pill({
  children,
  n = 1,
}: {
  children: React.ReactNode
  n: number
}) {
  const bg = colors[n % colors.length]
  return (
    <span
      className={`${bg} p-0.5 -m-0.5 rounded font-mono`}
      style={{ color: "var(--ch-2)" }}
    >
      {children}
    </span>
  )
}
