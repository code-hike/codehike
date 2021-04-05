import React from "react"
import { MiniEditor as Editor } from "@code-hike/mini-editor"
import { Page } from "./utils"
import "@code-hike/mini-editor/dist/index.css"

export default {
  title: "Mini Editor",
}

const code1 = `console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)`

export const focusEditor = () => {
  const [input, setInput] = React.useState("1:5")
  const [focus, setFocus] = React.useState(null)
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
      <Editor code={code1} file="index.js" focus={focus} />
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
        <button onClick={_ => setCode(input)}>
          Change
        </button>
      </div>
      <Editor code={code} file="index.js" />
    </Page>
  )
}
