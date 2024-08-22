"use client"

import { AnnotationHandler } from "codehike/code"
import { useState } from "react"

export const InlineFold: AnnotationHandler["Inline"] = ({ children }) => {
  const [folded, setFolded] = useState(true)
  if (!folded) {
    return children
  }
  return (
    <button onClick={() => setFolded(false)} aria-label="Expand">
      ...
    </button>
  )
}
