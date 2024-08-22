"use client"

import { HighlightedCode, Pre } from "codehike/code"
import React from "react"

export function CodeWithOccurrences({ code }: { code: HighlightedCode }) {
  const ref = React.useRef<HTMLPreElement>(null)
  React.useEffect(() => {
    const handler: EventListener = (e) => {
      const selected = document.getSelection()!.toString().trim()
      ref.current!.querySelectorAll("span:not(:has(*))").forEach((element) => {
        if (element.textContent === selected) {
          element.setAttribute("data-selected", "true")
        } else {
          element.removeAttribute("data-selected")
        }
      })
    }
    document.addEventListener("selectionchange", handler)
    return () => {
      document.removeEventListener("selectionchange", handler)
    }
  }, [])

  return (
    <Pre
      ref={ref}
      code={code}
      // components2={{ Token }}
    />
  )
}

// const Token: TokenComponent = ({ value, lineNumber, ...props }) => {
//   return (
//     <span
//       {...props}
//       className="data-[selected]:bg-blue-500/40 data-[selected]:rounded"
//     >
//       {value}
//     </span>
//   )
// }
