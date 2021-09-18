import React from "react"
import { Page } from "./utils"
import { CodeSpring } from "@code-hike/smooth-code"
import theme from "shiki/themes/poimandres.json"
import { highlight } from "@code-hike/highlighter"

export default {
  title: "Test/Code Spring",
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

  const prevAnnotations = [
    { focus: "1[10:11]" },
    { focus: "2[1:5]" },
    { focus: "3[8]" },
  ]

  const nextAnnotations = [
    { focus: "1[6:10]" },
    { focus: "2[1:5]" },
  ]
  const [steps, setSteps] = React.useState(null)
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    Promise.all([
      highlight({ code: prevCode, lang: "js", theme }),
      highlight({ code: nextCode, lang: "js", theme }),
    ]).then(([prevCode, nextCode]) =>
      setSteps([
        {
          code: prevCode,
          focus: "1",
          annotations: prevAnnotations,
        },
        {
          code: nextCode,
          focus: "2",
          annotations: nextAnnotations,
        },
      ])
    )
  }, [])

  return (
    <Page>
      <button onClick={() => setIndex((index + 1) % 2)}>
        Change
      </button>
      <div
        style={{ height: 300, outline: "1px solid red" }}
      >
        {steps ? (
          <CodeSpring
            step={steps[index]}
            config={{
              horizontalCenter: center,
              htmlProps: { style: { height: "100%" } },
              theme,
            }}
          />
        ) : (
          "Loading..."
        )}
      </div>
    </Page>
  )
}
