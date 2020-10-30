import React from "react"
import { MiniEditor } from "@code-hike/mini-editor"
import { Page, WithProgress } from "./utils"

export default {
  title: "Mini Editor",
}

const code1 = `console.log(1)`
const code2 = `console.log(1)
console.log(2)`
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

export const files = () => {
  const steps = [
    { code: code1, file: "foo.js" },
    { code: code2, file: "bar.js" },
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
