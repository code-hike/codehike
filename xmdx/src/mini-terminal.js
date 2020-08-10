import React from "react"
import { MiniTerminal } from "@code-hike/mini-terminal"
import { useSpring } from "use-spring"

export function Terminal({ snippets, index }) {
  const steps = snippets.map(text => ({ text }))
  const [progress] = useSpring(index, {
    decimals: 3,
    stiffness: 34,
    damping: 12,
  })
  return (
    <div style={{ width: 300 }}>
      <MiniTerminal
        progress={progress}
        steps={steps}
        style={{ height: 200 }}
      />
    </div>
  )
}
