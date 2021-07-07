import React from "react"
import {
  MiniEditor as Editor,
  MiniEditor,
} from "@code-hike/mini-editor"
import { Page } from "./utils"
import "@code-hike/mini-editor/dist/index.css"

export default {
  title: "Mini Editor",
  component: MiniEditor,
  parameters: {
    componentSubtitle:
      "Displays an image that represents a user or organization",
  },
  argTypes: {
    label: {
      description: "Overwritten description",
      table: {
        type: {
          summary: "Something short",
          detail: "Something really really long",
        },
      },
      control: {
        type: null,
      },
    },
  },
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
      <Editor
        code={code1}
        filename="index.js"
        focus={focus}
        lang="js"
      />
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
      <Editor code={code} filename="index.js" lang="js" />
    </Page>
  )
}
