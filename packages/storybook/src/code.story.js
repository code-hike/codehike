import React from "react"
import { WithProgress } from "./utils"
import { Code, CodeTween } from "@code-hike/smooth-code"
import poimandres from "shiki/themes/solarized-dark.json"

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

  return (
    <WithProgress>
      {progress => (
        <div
          style={{ height: 300, outline: "1px solid red" }}
        >
          <Code
            progress={progress}
            code={{ prev: prevCode, next: nextCode }}
            focus={{ prev: "1", next: "1" }}
            horizontalCenter={center}
            language="js"
            htmlProps={{ style: { height: "100%" } }}
            theme={poimandres}
          />
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

  const prevAnnotations = [{ focus: "3:5" }]

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
          <Code
            progress={progress}
            code={{ prev: prevCode, next: nextCode }}
            focus={{ prev: "3:10", next: "" }}
            horizontalCenter={false}
            language="js"
            htmlProps={{ style: { height: "100%" } }}
            theme={poimandres}
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

export const withShiki = () => {
  const sampleCode = `import * as React from 'react';

function App() {
  return <div className="App"/>
}`

  return (
    <WithProgress>
      {progress => (
        <div
          style={{ height: 300, outline: "1px solid red" }}
        >
          <CodeTween
            code={sampleCode}
            lang={"js"}
            theme={poimandres}
            htmlProps={{ style: { height: "100%" } }}
          />
        </div>
      )}
    </WithProgress>
  )
}
