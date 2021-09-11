import React from "react"
import { WithProgress } from "./utils"
import {
  highlight,
  Code,
  HeavyCode,
} from "@code-hike/smooth-code"
import theme from "shiki/themes/poimandres.json"

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

export const basic = ({ center }) => {
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

  return (
    <WithProgress>
      {progress => (
        <div
          style={{ height: 300, outline: "1px solid red" }}
        >
          <HeavyCode
            progress={progress}
            code={{ prev: prevCode, next: nextCode }}
            focus={{ prev: "1", next: "1" }}
            horizontalCenter={center}
            language="js"
            htmlProps={{ style: { height: "100%" } }}
            theme={theme}
            annotations={{
              prev: [
                { focus: "1[10:11]" },
                { focus: "2[1:5]" },
                { focus: "3[8]" },
              ],
              next: [
                { focus: "1[6:10]" },
                { focus: "2[1:5]" },
              ],
            }}
          />
        </div>
      )}
    </WithProgress>
  )
}
export const light = ({ center }) => {
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
  const [lines, setLines] = React.useState(null)

  React.useEffect(() => {
    highlight(
      { prev: prevCode, next: nextCode },
      "js",
      theme
    ).then(lines => setLines(lines))
  }, [])

  return (
    <WithProgress>
      {progress => (
        <div
          style={{ height: 300, outline: "1px solid red" }}
        >
          {lines ? (
            <Code
              progress={progress}
              focus={{ prev: "1", next: "1" }}
              horizontalCenter={center}
              highlightedLines={lines}
              htmlProps={{ style: { height: "100%" } }}
              theme={theme}
              annotations={{
                prev: [
                  { focus: "1[10:11]" },
                  { focus: "2[1:5]" },
                  { focus: "3[8]" },
                ],
                next: [
                  { focus: "1[6:10]" },
                  { focus: "2[1:5]" },
                ],
              }}
            />
          ) : (
            "Loading..."
          )}
        </div>
      )}
    </WithProgress>
  )
}

export const second = () => {
  const prevCode = `
import * as React from 'react';

console.log(1)
console.log(2)
console.log(3)

console.log(1)
console.log(2)
console.log(3)

console.log(1)
console.log(2)
console.log(3)

console.log(1)
console.log(2)
console.log(3)

console.log(1)
console.log(2)
console.log(3)

function App() {
  return <div className="App"/>
}
`.trim()

  const prevAnnotations = [
    {
      focus: "3",
      Component: Annotate,
      data: { caption: "lorem ipsum" },
    },
    {
      focus: "4",
      Component: Annotate,
      data: { caption: "dolor sit amet" },
    },
  ]

  const nextCode = `
console.log(1)
console.log(3)
const x = (y) => y++
`.trim()

  return (
    <WithProgress>
      {progress => (
        <div
          style={{ height: 300, outline: "1px solid red" }}
        >
          <HeavyCode
            progress={progress}
            code={{ prev: prevCode, next: nextCode }}
            focus={{ prev: "3:10", next: "" }}
            horizontalCenter={false}
            language="js"
            htmlProps={{ style: { height: "100%" } }}
            theme={theme}
            minZoom={1}
            maxZoom={1}
            annotations={{
              prev: prevAnnotations,
              next: [],
            }}
          />
        </div>
      )}
    </WithProgress>
  )
}

function Annotate({ style, children, data }) {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      style={{
        ...style,
        background: hover
          ? selectedBackground(theme)
          : undefined,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <div
        style={{
          position: "absolute",
          right: 0,
          paddingRight: 10,
          display: hover ? "block" : "none",
          opacity: 0.7,
        }}
      >
        {data.caption}
      </div>
    </div>
  )
}

function selectedBackground(theme) {
  return (
    theme.colors["editor.lineHighlightBackground"] ||
    theme.colors["editor.selectionHighlightBackground"]
  )
}
