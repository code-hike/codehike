import React from "react"
import { SmoothLines } from "@code-hike/smooth-lines"
import { WithProgress } from "./utils"

export default {
  title: "Smooth Lines",
}

export const basic = () => (
  <WithProgress>
    {progress => (
      <SmoothLines
        center
        progress={progress}
        containerWidth={150}
        containerHeight={200}
        prevLines={prevLines}
        nextLines={nextLines}
        lineHeight={lineHeight}
        lineWidth={lineWidth}
        prevFocus={[0, 3]}
        nextFocus={[8, 9]}
      />
    )}
  </WithProgress>
)

const prevLines = [
  { element: <Line>Hi</Line>, key: 1 },
  { element: <Line>Smooth</Line>, key: 2 },
  { element: <Line>Smoooth</Line>, key: 2.8 },
  { element: <Line>Lines</Line>, key: 3 },
  { element: <Line>New 2</Line>, key: 5.1 },
]
const nextLines = [
  { element: <Line>Hi</Line>, key: 1 },
  { element: <Line>New</Line>, key: 2.1 },
  { element: <Line>Lines</Line>, key: 3 },
  { element: <Line>New 2</Line>, key: 3.1 },
  { element: <Line>Lines</Line>, key: 4 },
  { element: <Line>New 2</Line>, key: 5.1 },
  { element: <Line>New 2</Line>, key: 6.1 },
  { element: <Line>Lines</Line>, key: 6.2 },
  { element: <Line>New 2</Line>, key: 6.3 },
  { element: <Line>New 2</Line>, key: 7.1 },
  { element: <Line>Lines</Line>, key: 7.2 },
  { element: <Line>New 2</Line>, key: 7.3 },
]

const lineHeight = 20
const lineWidth = 100

function Line({ children }) {
  return (
    <div
      style={{
        background: "lightblue",
        border: "2px solid blue",
        height: lineHeight,
        width: lineWidth,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  )
}
