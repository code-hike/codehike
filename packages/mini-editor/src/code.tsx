import React from "react"
import { codeDiff, CodeLine } from "@code-hike/code-diff"
import { SmoothLines } from "@code-hike/smooth-lines"

type CodeProps = {
  prevCode: string
  nextCode: string
  progress: number
  language: string
}

export function Code({
  prevCode,
  nextCode,
  progress,
  language,
}: CodeProps) {
  const { prevKeys, nextKeys, codeMap } = codeDiff({
    prevCode,
    nextCode,
    lang: language,
  })

  const prevLines = prevKeys.map(key => ({
    key,
    element: <Line line={codeMap[key]} />,
  }))

  const nextLines = nextKeys.map(key => ({
    key,
    element: <Line line={codeMap[key]} />,
  }))

  return (
    <pre className={`language-${language}`}>
      <code>
        <SmoothLines
          center={false}
          progress={progress}
          containerWidth={200}
          containerHeight={100}
          prevLines={prevLines}
          nextLines={nextLines}
          lineHeight={20}
          lineWidth={200}
          prevFocus={[1, 1]}
          nextFocus={[1, 1]}
        />
      </code>
    </pre>
  )
}

function Line({ line }: { line: CodeLine }) {
  return (
    <div
      style={{
        height: 20,
        width: 200,
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
