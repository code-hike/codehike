import React from "react"
import { WithProgress } from "./utils"
import { CodeTween } from "@code-hike/smooth-code"
import theme from "shiki/themes/poimandres.json"
import { highlight } from "@code-hike/highlighter"

export default {
  title: "Test/Code Tween",
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
  const [tween, setTween] = React.useState(null)

  React.useEffect(() => {
    Promise.all([
      highlight({ code: prevCode, lang: "js", theme }),
      highlight({ code: nextCode, lang: "js", theme }),
    ]).then(([prevCode, nextCode]) =>
      setTween({
        prev: {
          code: prevCode,
          focus: "1",
          annotations: prevAnnotations,
        },
        next: {
          code: nextCode,
          focus: "2",
          annotations: nextAnnotations,
        },
      })
    )
  }, [])

  console.log({ tween })

  return (
    <WithProgress>
      {progress => (
        <div
          style={{ height: 300, outline: "1px solid red" }}
        >
          {tween ? (
            <CodeTween
              progress={progress}
              tween={tween}
              style={{ height: "100%" }}
              config={{ horizontalCenter: center, theme }}
            />
          ) : (
            "Loading..."
          )}
        </div>
      )}
    </WithProgress>
  )
}
