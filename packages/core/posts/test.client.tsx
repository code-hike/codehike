"use client"

import React from "react"

export function TestClient() {
  const [x, setX] = React.useState(0)
  return (
    <div style={{ border: "1px solid red" }}>
      <div>Test Client</div>
      <div>{x}</div>
      <button onClick={() => setX(x + 1)}>+</button>
    </div>
  )
}
