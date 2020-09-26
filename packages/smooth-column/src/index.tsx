import React from "react"

export { SmoothColumn }

type Props = {
  steps: Step[]
  padding: number
  progress: number
}

type Step = {
  items: Item[]
}

type Item = {
  height: number
  element: React.ReactNode
}

function SmoothColumn({ steps, padding, progress }: Props) {
  return steps[progress].items.map(item => (
    <div style={{ height: item.height }}>
      {item.element}
    </div>
  ))
}
