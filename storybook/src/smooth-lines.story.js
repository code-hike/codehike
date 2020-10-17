import React from "react"
import { SmoothLines } from "@code-hike/smooth-lines"
import { WithProgress } from "./utils"

export default {
  title: "Smooth Lines",
  argTypes: {
    center: { control: "boolean" },
    containerWidth: {
      control: {
        type: "range",
        min: 100,
        max: 200,
        step: 1,
      },
      defaultValue: 150,
    },
  },
}

export const basic = ({ center, containerWidth }) => (
  <WithProgress>
    {progress => (
      <SmoothLines
        center={center}
        progress={progress}
        containerWidth={containerWidth}
        containerHeight={100 + progress * 30}
        prevLines={prevLines}
        nextLines={nextLines}
        lineHeight={lineHeight}
        lineWidth={lineWidth}
        prevFocus={[1, 1]}
        nextFocus={[3, 11]}
      />
    )}
  </WithProgress>
)

const prevLines = [
  { element: <Line>Hi</Line>, key: 1 },
  { element: <Line>Smooth**</Line>, key: 2 },
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
  { element: <Line>New 2**</Line>, key: 7.1 },
  { element: <Line>Lines</Line>, key: 7.2 },
  { element: <Line>New 2</Line>, key: 7.3 },
]

const lineHeight = 20
const lineWidth = 120

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
