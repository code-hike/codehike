import React from "react"
import { Page } from "./utils"
import { CodeSpring } from "@code-hike/smooth-code"
import theme from "shiki/themes/poimandres.json"
import { highlight } from "@code-hike/highlighter"

export default {
  title: "Test/Code",
}

export const autoHeigth = ({}) => {
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

function CodePage({ code, focus, annotations }) {
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
    <CodeSpring step={step} config={{ theme }} />
  ) : (
    "Loading..."
  )
}
