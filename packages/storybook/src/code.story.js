import React from "react"
import { Page } from "./utils"
import { CodeSpring } from "@code-hike/smooth-code"
import theme from "shiki/themes/poimandres.json"
import { highlight } from "@code-hike/highlighter"

export default {
  title: "Test/Code",
}

export const autoHeigth = () => {
  const oneLine = `
console.log(1)
`.trim()

  const threeLines = `
console.log(1)
console.log(2)
console.log(3)
`.trim()

  const fiveLines = `
console.log(1)
console.log(2)
console.log(3)
console.log(3)
console.log(3)
`.trim()

  return (
    <Page>
      <CodePage code={oneLine} focus="1" />
      <hr />
      <CodePage code={threeLines} focus="1" />
      <hr />
      <CodePage code={threeLines} focus="1:2" />
      <hr />
      <CodePage code={fiveLines} focus="1" />
      <hr />
      <CodePage code={fiveLines} focus="3:5" />
    </Page>
  )
}

export const overflow = () => {
  const verticalCode = `
console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)
console.log(9)
console.log(10)
`.trim()
  const horizontalCode = `
console.log("lorem ipsum dolor sit amet")
console.log("lorem ipsum dolor sit amet lorem ipsum lorem ipsum lorem ipsum")
console.log("lorem ipsum dolor sit amet")
console.log("lorem ipsum dolor sit amet")
`.trim()

  const both = `
console.log(1)
console.log(2)
console.log(3)
console.log("lorem ipsum dolor sit amet")
console.log("lorem ipsum dolor sit amet lorem ipsum lorem ipsum lorem ipsum")
console.log("lorem ipsum dolor sit amet")
console.log(6)
console.log(7)
console.log(8)
console.log(9)
console.log(10)
`.trim()

  return (
    <Page>
      <CodePage
        code={verticalCode}
        focus="2:7"
        config={{
          htmlProps: {
            style: { height: 100 },
          },
        }}
      />
      <hr />
      <CodePage
        code={horizontalCode}
        focus=""
        config={{
          htmlProps: {
            style: { height: 100 },
          },
        }}
      />
      <hr />

      <CodePage
        code={both}
        focus="2:7"
        config={{
          htmlProps: {
            style: { height: 100 },
          },
        }}
      />
    </Page>
  )
}

function CodePage({ code, focus, annotations, config }) {
  const [step, setStep] = React.useState(null)

  React.useEffect(() => {
    highlight({
      code: code,
      lang: "js",
      theme,
    }).then(code =>
      setStep({
        code,
        focus,
        annotations: annotations,
      })
    )
  }, [])

  return step ? (
    <CodeSpring step={step} config={{ theme, ...config }} />
  ) : (
    "Loading..."
  )
}
