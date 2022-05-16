import React from "react"

export function ExpandButton({
  style,
}: {
  style?: React.CSSProperties
}) {
  const [expanded, setExpanded] = React.useState(false)

  return (
    <>
      <svg
        style={{
          width: "1.5em",
          height: "1.5em",
          cursor: "pointer",
          ...style,
        }}
        onClick={() => {
          setExpanded(true)
        }}
        className="ch-expand-button"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Expand</title>

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
      <dialog open={expanded}>Hey</dialog>
    </>
  )
}
