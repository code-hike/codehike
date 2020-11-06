import React from "react"
import { MiniEditor } from "@code-hike/mini-editor"
import { Page, WithProgress } from "./utils"

export default {
  title: "Mini Editor",
}

const code1 = `console.log(1)`
const code2 = `console.log(1)
console.log(200)`
const terminal1 = `$ lorem ipsum
dolor sit amet
consectetur adipiscing elit
$ sed do`
const terminal2 = `$ eiusmod tempor incididunt
ut labore et dolore`

export const empty = () => (
  <Page>
    <MiniEditor />
  </Page>
)

export const justCode = () => (
  <Page>
    <MiniEditor code={code1} />
  </Page>
)

export const code = () => {
  const steps = [{ code: code1 }, { code: code2 }]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 200 }}
          lang="js"
          file="index.js"
          steps={steps}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}
export const changeWidth = () => {
  const code1 = `console.log(1)
console.log(2)
console.log(1)`
  const code2 = `console.log(1)
console.log(100000000, 100000000)
console.log(1)`
  const steps = [
    { code: code1, focus: "2" },
    { code: code2, focus: "2" },
  ]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 200, width: 200 }}
          lang="js"
          file="index.js"
          steps={steps}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

export const focusLine = () => {
  const code1 = `console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)`
  const steps = [
    { code: code1, focus: "2" },
    { code: code1, focus: "7" },
  ]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 200 }}
          lang="js"
          file="index.js"
          steps={steps}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

export const focusManyLines = () => {
  const code1 = `console.log(1)
console.log(2)
console.log(3)
console.log(4)
console.log(5)
console.log(6)
console.log(7)
console.log(8)`
  const steps = [
    { code: code1, focus: "1" },
    { code: code1, focus: "2:7" },
  ]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 100 }}
          lang="js"
          file="index.js"
          steps={steps}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

export const files = () => {
  const steps = [
    { code: "log('foo',1)", file: "foo.js" },
    { code: "log('foo',2)", file: "foo.js" },
    { code: "log('bar',1)", file: "bar.js" },
    { code: "log('bar',2)", file: "bar.js" },
    { code: "log('foo',3)", file: "foo.js" },
  ]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 300 }}
          lang="js"
          steps={steps}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

export const terminal = () => {
  const steps = [
    { code: code1 },
    { code: code1, terminal: terminal1 },
    { code: code1, terminal: terminal2 },
    { code: code2 },
  ]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 300 }}
          lang="js"
          file="foo.js"
          steps={steps}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

export const xfiles = () => {
  return (
    <WithProgress length={xsteps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 300 }}
          lang="js"
          steps={xsteps}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

const xsteps = [
  {
    code: "",
    file: "",
    focus: "",
    lang: "javascript",
    tabs: ["", "index.jsx"],
  },
  {
    code: "",
    file: "",
    focus: "",
    lang: "javascript",
    tabs: ["", "index.jsx"],
  },
  {
    code:
      'function ShoppingList(props) {\n  return (\n    <div className="shopping-list">\n      <h1>Shopping List for {props.name}</h1>\n      <ul>\n        <li>Instagram</li>\n        <li>WhatsApp</li>\n        <li>Oculus</li>\n      </ul>\n    </div>\n  )\n}\n',
    file: "index.jsx",
    focus: "",
    lang: "jsx",
    tabs: ["", "index.jsx"],
  },
  {
    code:
      'function ShoppingList(props) {\n  return React.createElement(\n    "div",\n    { className: "shopping-list" },\n    React.createElement(\n      "h1", null, "Shopping List for ", props.name\n    ),\n    React.createElement(\n      "ul",\n      null,\n      React.createElement("li", null, "Instagram"),\n      React.createElement("li", null, "WhatsApp"),\n      React.createElement("li", null, "Oculus")\n    )\n  )\n}\n',
    file: "index.jsx",
    focus: "",
    lang: "jsx",
    tabs: ["", "index.jsx"],
  },
  {
    code: "",
    file: "",
    focus: "",
    lang: "javascript",
    tabs: ["", "index.jsx"],
  },
  {
    code: "",
    file: "",
    focus: "",
    lang: "javascript",
    tabs: ["", "index.jsx"],
  },
  {
    code: "",
    file: "",
    focus: "",
    lang: "javascript",
    tabs: ["", "index.jsx"],
  },
  {
    code: "",
    file: "",
    focus: "",
    lang: "javascript",
    tabs: ["", "index.jsx"],
  },
]
