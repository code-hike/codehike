import React from "react"
import {
  EditorTween,
  EditorSpring,
} from "@code-hike/mini-editor"
import { Page } from "./utils"
import "@code-hike/mini-editor/dist/index.css"
import theme from "shiki/themes/one-dark-pro.json"
import { highlight } from "@code-hike/highlighter"

export default {
  title: "Test/Editor Display",
}

export const flow = () => {
  return (
    <Page className="longer">
      <EditorTest
        code="console.log(1)"
        contentHeight={true}
      />
      <EditorTest code={moreCode} contentHeight={true} />
      <EditorTest
        code={evenMoreCode}
        contentHeight={true}
      />
    </Page>
  )
}

const moreCode = `
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
`.trim()
const evenMoreCode = `
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
console.log(1)
`.trim()

export const height = () => {
  return (
    <Page>
      <div className="longer">
        <EditorTest
          code="console.log(1)"
          style={{ height: 400 }}
        />
      </div>
    </Page>
  )
}

export const flex = () => {
  return (
    <Page>
      <div
        className="longer"
        style={{
          display: "flex",
          flexFlow: "column",
          height: 400,
        }}
      >
        <EditorTest
          code="console.log(1)"
          style={{ flex: 1 }}
        />
        <EditorTest
          code="console.log(2)"
          style={{ flex: 2, margin: 20 }}
        />
      </div>
    </Page>
  )
}

function EditorTest({
  code: inputCode,
  lang = "js",
  focus = "",
  annotations = [],
  style,
  ...rest
}) {
  const [code, setCode] = React.useState(null)

  React.useEffect(() => {
    highlight({
      code: inputCode,
      lang,
      theme,
    }).then(code => setCode(code))
  }, [inputCode])

  const step = {
    files: [
      {
        name: "index.js",
        code,
        focus,
        annotations,
      },
    ],
    northPanel: {
      tabs: ["index.js"],
      active: "index.js",
      heightRatio: 1,
    },
  }
  return code ? (
    <EditorSpring
      {...step}
      codeConfig={{ theme }}
      frameProps={{}}
      style={style}
      {...rest}
    />
  ) : (
    <div style={style}>"Loading..."</div>
  )
}
