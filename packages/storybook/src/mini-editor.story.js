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
          minColumns={10}
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

export const x = () => {
  return (
    <WithProgress length={xprops.steps.length}>
      {(progress, backward) => (
        <MiniEditor
          style={{ height: 300 }}
          {...xprops}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

const xprops = {
  steps: [
    {
      code:
        "<html>\n  <body>\n    <style>\n      h1 {\n        border: 4px solid black;\n        padding: 20px 7px;\n        margin: 0;\n      }\n    </style>\n    <h1>Lorem ipsum dolor sit amet</h1>\n  </body>\n</html>\n",
    },
    {
      code:
        "<html>\n  <body>\n    <style>\n      h1 {\n        border: 4px solid black;\n        padding: 20px 7px;\n        margin: 0;\n        filter: blur(3px);\n      }\n    </style>\n    <h1>Lorem ipsum dolor sit amet</h1>\n  </body>\n</html>\n",
      focus: "4,8,9",
    },
    {
      code:
        "<html>\n  <body>\n    <style>\n      h1 {\n        border: 4px solid black;\n        padding: 20px 7px;\n        margin: 0;\n        filter: drop-shadow(\n          2px 2px 2px blue\n        );\n      }\n    </style>\n    <h1>Lorem ipsum dolor sit amet</h1>\n  </body>\n</html>\n",
      focus: "4,8:11",
    },
  ],
  lang: "html",
  file: "index.html",
}
