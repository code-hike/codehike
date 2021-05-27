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

export const singlePanelEditor = () => {
  const [input, setInput] = React.useState(code1)
  const [code, setCode] = React.useState(code1)
  const files = [
    { name: "index.js", lang: "js", code: "" },
    { name: "app.js", lang: "js", code },
  ]
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
      <Editor
        files={files}
        active="app.js"
        codeProps={{ maxZoom: 4, minColumns: 10 }}
      />
    </Page>
  )
}

export const twoPanelEditor = () => {
  const [input, setInput] = React.useState(code1)
  const [code, setCode] = React.useState(code1)
  const files = [
    {
      name: "index.js",
      lang: "js",
      code: "console.log(1)",
    },
    { name: "app.js", lang: "js", code },
  ]
  const northPanel = {
    active: "app.js",
    tabs: ["app.js"],
    heightRatio: 0.5,
  }
  const southPanel = {
    active: "index.js",
    tabs: ["index.js"],
    heightRatio: 0.5,
  }
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
      <Editor
        files={files}
        northPanel={northPanel}
        southPanel={southPanel}
        codeProps={{ maxZoom: 1.2, minColumns: 10 }}
        frameProps={{ height: 500 }}
      />
    </Page>
  )
}
