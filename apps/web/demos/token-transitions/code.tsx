"use client"

import React from "react"
import { HighlightedCode } from "codehike/code"
import { Pre } from "codehike/code"
import { tokenTransitions } from "@/components/annotations/token-transitions"

export function CodeSwitcher({ infos }: { infos: HighlightedCode[] }) {
  const [index, setIndex] = React.useState(0)
  const next = () => setIndex((index + 1) % infos.length)

  return (
    <>
      <CodeClient highlighted={infos[index]} />
      <div className="p-2 mt-auto font-light text-center text-white">
        <button onClick={next} className="border border-current rounded px-2">
          Switch code
        </button>
      </div>
    </>
  )
}

export function CodeClient(props: { highlighted: HighlightedCode }) {
  const { highlighted } = props
  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions]}
      className="m-0 h-80 bg-zinc-950/80"
    />
  )
}
