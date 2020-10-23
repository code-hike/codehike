import React from "react"
import { SmoothLines } from "@code-hike/smooth-lines"
import { WithProgress } from "./utils"
import { codeDiff } from "@code-hike/code-diff"

export default {
  title: "Smooth Code",
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
      <pre>
        <code>
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
            nextFocus={[1, 1]}
          />
        </code>
      </pre>
    )}
  </WithProgress>
)

const lineHeight = 20
const lineWidth = 120

const prevCode = `
console.log(1)
console.log(2)
console.log(3)
`.trim()

const nextCode = `
console.log(1)
console.log(3)
console.log(4)
`.trim()

const { prevKeys, nextKeys, codeMap } = codeDiff({
  prevCode,
  nextCode,
  lang: "javascript",
})

const prevLines = prevKeys.map(key => ({
  key,
  element: <Line line={codeMap[key]} />,
}))

const nextLines = nextKeys.map(key => ({
  key,
  element: <Line line={codeMap[key]} />,
}))

function Line({ line }) {
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
      {line.map(([token, type]) => (
        <span className={type}>{token}</span>
      ))}
    </div>
  )
}
