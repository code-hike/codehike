import React from "react"
import { SmoothLines } from "@code-hike/smooth-lines"
import { WithProgress } from "./utils"
import { codeDiff } from "@code-hike/code-diff"

export default {
  title: "Test/Smooth Code",
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

export const basic = ({ center, containerWidth }) => {
  const prevCode = `
console.log(1)
console.log(2)
console.log(3)
`.trim()

  const nextCode = `
console.log(1)
console.log(3)
const x = (y) => y++
`.trim()
  const { prevLines, nextLines } = getLines(
    prevCode,
    nextCode
  )

  return (
    <WithProgress>
      {progress => (
        <pre className="language-javascript">
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
}

export const onlyEnter = ({ center, containerWidth }) => {
  const prevCode = `
console.log(1)
`.trim()

  const nextCode = `
console.log(1)
console.log(2)
`.trim()
  const { prevLines, nextLines } = getLines(
    prevCode,
    nextCode
  )

  return (
    <WithProgress>
      {progress => (
        <pre className="language-javascript">
          <code>
            <SmoothLines
              center={center}
              progress={progress}
              containerWidth={containerWidth}
              containerHeight={100}
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
}

const lineHeight = 20
const lineWidth = 120

function getLines(prevCode, nextCode) {
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

  return { prevLines, nextLines }
}

function Line({ line }) {
  return (
    <div
      style={{
        // background: "lightblue",
        // border: "2px solid blue",
        height: lineHeight,
        width: lineWidth,
        boxSizing: "border-box",
      }}
    >
      {line.map(([token, type], i) => (
        <span className={`token ${type}`} key={i + 1}>
          {token}
        </span>
      ))}
    </div>
  )
}
