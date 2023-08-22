"use client"

import React from "react"
import { FlipCode } from "../src/flip-tokens"

export function Code({ children, tokens }) {
  const [x, setX] = React.useState(0)
  return (
    <div>
      <FlipCode tokens={tokens} />
      <button onClick={() => setX(x + 1)}>{x}</button>
    </div>
  )
}
