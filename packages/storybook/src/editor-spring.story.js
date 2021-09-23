import React from "react"
import { EditorSpring } from "@code-hike/mini-editor"
import { Page } from "./utils"
import "@code-hike/mini-editor/dist/index.css"
import theme from "shiki/themes/dark-plus.json"
import { highlight } from "@code-hike/highlighter"

export default {
  title: "Test/Editor Spring",
}
const code1 = `console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)`

export const focusEditor = () => {
  const [input, setInput] = React.useState("1:5")
  const [focus, setFocus] = React.useState("1:5")

  return (
    <Page>
      <div style={{ margin: "20px auto", display: "flex" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={_ => setFocus(input)}>
          Focus
        </button>
      </div>
      <SingleEditor inputCode={code1} focus={focus} />
    </Page>
  )
}

export const codeEditor = () => {
  const [input, setInput] = React.useState(code1)
  const [code, setCode] = React.useState(code1)

  return (
    <Page>
      <div style={{ margin: "20px auto", display: "flex" }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={5}
        />
        <button onClick={() => setCode(input)}>
          Change
        </button>
      </div>
      <SingleEditor inputCode={code} />
    </Page>
  )
}

export const annotations = () => {
  return (
    <Page>
      <SingleEditor
        inputCode={code1}
        lang="js"
        annotations={[{ focus: "2:3" }]}
      />
    </Page>
  )
}

function SingleEditor({
  inputCode,
  focus = "",
  annotations = [],
}) {
  const [code, setCode] = React.useState(null)

  React.useEffect(() => {
    highlight({
      code: inputCode,
      lang: "js",
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
    <EditorSpring {...step} codeConfig={{ theme }} />
  ) : (
    "Loading..."
  )
}
