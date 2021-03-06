import React from "react"
import { useFrame, Item } from "./use-frame"

export { SmoothColumn }

type Props = {
  steps: Step[]
  padding: number
  progress: number
  backward?: boolean
  style?: React.CSSProperties
}

type Step = {
  items: Item[]
}

function SmoothColumn({
  steps,
  padding,
  progress,
  style = {},
  backward,
}: Props) {
  const p = Math.min(
    Math.max(0, progress),
    steps.length - 1
  )
  const prevIndex = Math.floor(p)
  const nextIndex = prevIndex + 1
  const prevItems = steps[prevIndex]?.items || []
  const nextItems = steps[nextIndex]?.items || prevItems

  const { frame, height } = useFrame(
    prevItems,
    nextItems,
    p % 1,
    padding
  )

  return (
    <div
      style={{
        height,
        position: "relative",
        ...style,
      }}
    >
      {frame.map(
        ({ item, itemHeight, translateY, opacity }, i) => (
          <div
            style={{
              position: "absolute",
              top: "50%",
              width: "100%",
              height: item.height,
              transform: `translateY(${translateY}px)`,
              opacity: opacity,
            }}
            key={item.id == null ? i : item.id}
          >
            {React.cloneElement(item.element, {
              progress: p,
              backward,
              height: itemHeight,
            })}
          </div>
        )
      )}
    </div>
  )
}
