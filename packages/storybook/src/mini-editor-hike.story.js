import React from "react"
import { MiniEditorHike } from "@code-hike/mini-editor"
import { Page, WithProgress } from "./utils"
import "@code-hike/mini-editor/dist/index.css"

export default {
  title: "Test/Mini Editor Hike",
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
    <MiniEditorHike />
  </Page>
)

export const code = () => {
  const steps = [
    {
      files: [{ code: code1, name: "hi.js", lang: "js" }],
      northPanel: { active: "hi.js", tabs: ["hi.js"] },
    },
    {
      files: [{ code: code2, name: "hi.js", lang: "js" }],
      northPanel: { active: "hi.js", tabs: ["hi.js"] },
    },
  ]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditorHike
          frameProps={{ height: 200 }}
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
console.log(10000000000000000, 100000000000000)
console.log(1)`
  const steps = toSteps([
    { code: code1, focus: "2" },
    { code: code2, focus: "2" },
  ])
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditorHike
          steps={steps}
          progress={progress}
          backward={backward}
          frameProps={{ height: 200, width: 200 }}
          codeProps={{
            minColumns: 10,
            minZoom: 1,
            horizontalCenter: true,
          }}
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
        <MiniEditorHike
          frameProps={{ style: { height: 200 } }}
          steps={toSteps(steps)}
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
        <MiniEditorHike
          frameProps={{ style: { height: 100 } }}
          steps={toSteps(steps)}
          progress={progress}
          backward={backward}
          codeProps={{
            minZoom: 0.8,
          }}
        />
      )}
    </WithProgress>
  )
}

export const focusByColumn = () => {
  const code1 = `console.log(1)
console.log(2)
console.log(3)`
  const code2 = `console.log(1)
console.log(3)
console.log(4)`

  const steps = [
    { code: code1, focus: "1[4:7,9:11],3[1:7]" },
    { code: code1, focus: "1,2[1:7]" },
    { code: code2, focus: "1,3[9:11]" },
  ]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <MiniEditorHike
          frameProps={{ style: { height: 200 } }}
          steps={toSteps(steps)}
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
        <MiniEditorHike
          frameProps={{ style: { height: 300 } }}
          steps={toSteps(steps, ["foo.js", "bar.js"])}
          progress={progress}
          backward={backward}
          codeProps={{}}
        />
      )}
    </WithProgress>
  )
}

export const minColumns = () => {
  const steps = [{ code: "log('foo',1)" }]
  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <>
          <p>
            minColumns 5 (it doesn't zoom because maxZoom ==
            1)
          </p>
          <MiniEditorHike
            frameProps={{ style: { height: 300 } }}
            steps={toSteps(steps)}
            progress={progress}
            backward={backward}
            codeProps={{ minColumns: 5, maxZoom: 1 }}
          />
          <p>minColumns 80</p>
          <MiniEditorHike
            frameProps={{ style: { height: 300 } }}
            steps={toSteps(steps)}
            progress={progress}
            backward={backward}
            codeProps={{ minColumns: 80 }}
          />
        </>
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
        <MiniEditorHike
          frameProps={{ style: { height: 300 } }}
          steps={toSteps(steps)}
          progress={progress}
          backward={backward}
        />
      )}
    </WithProgress>
  )
}

export const withButton = () => {
  return (
    <Page>
      <MiniEditorHike
        frameProps={{
          style: { height: 200 },
          button: <CodeSandboxIcon />,
        }}
        steps={toSteps([{ code: code1 }])}
        progress={0}
      />
    </Page>
  )
}

export const manyTabs = () => {
  return (
    <Page>
      <h2>Three tabs</h2>
      <MiniEditorHike
        frameProps={{
          style: { height: 200 },
        }}
        steps={toSteps(
          [{ code: code1 }],
          ["index.js", "two.css", "three.html"]
        )}
        progress={0}
      />
      <h2>With button</h2>
      <MiniEditorHike
        frameProps={{
          style: { height: 200 },
          button: <CodeSandboxIcon />,
        }}
        steps={toSteps(
          [{ code: code1 }],
          ["index.js", "two.css", "three.html"]
        )}
        progress={0}
      />
      <h2>Long name</h2>
      <MiniEditorHike
        frameProps={{
          style: { height: 200 },
          button: <CodeSandboxIcon />,
        }}
        steps={toSteps(
          [
            {
              code: code1,
              file: "index-with-long-name.js",
            },
          ],
          [
            "index-with-long-name.js",
            "two.css",
            "three.html",
          ]
        )}
        progress={0}
      />
      <h2>Six tabs</h2>
      <MiniEditorHike
        frameProps={{
          style: { height: 200 },
          button: <CodeSandboxIcon />,
        }}
        steps={toSteps(
          [
            {
              code: code1,
              file: "two.js",
            },
          ],
          [
            "index.js",
            "two.js",
            "three.html",
            "four.js",
            "five.css",
            "six.html",
          ]
        )}
        progress={0}
      />
    </Page>
  )
}

export const x = () => {
  return (
    <WithProgress length={xsteps.length}>
      {(progress, backward) => (
        <MiniEditorHike
          steps={toSteps(
            xsteps,
            ["index.js"],
            "index.js",
            "jsx"
          )}
          progress={progress}
          backward={backward}
          frameProps={{
            style: { height: 300 },
          }}
          codeProps={{ minColumns: 50 }}
        />
      )}
    </WithProgress>
  )
}

function toSteps(
  codeSteps,
  tabs = null,
  name = "index.js",
  lang = "js"
) {
  return codeSteps.map(codeStep => ({
    files: [
      {
        name: codeStep.file || name,
        lang,
        code: codeStep.code,
        focus: codeStep.focus,
      },
    ],
    northPanel: {
      active: codeStep.file || name,
      tabs: tabs || [codeStep.file || name],
      heightRatio: 1,
    },
    terminal: codeStep.terminal,
  }))
}

const xsteps = [
  {
    code: `const app = <h1 style={{ color: 'blue' }}>Hello World</h1>

ReactDOM.render(app, document.getElementById('root'))`,
    focus: "3",
  },
  {
    code: `function MyComponent() {
  return (
    <div>
      <button>Hello</button>
      <button>Hello</button>
      <button>Hello</button>
      <button>Hello</button>
      <button>Hello</button>
    </div>
  )
}

const app = <h1 style={{ color: 'blue' }}>Hello World</h1>

ReactDOM.render(app, document.getElementById('root'))`,
    focus: "1:7",
  },
  {
    code: `function MyComponent() {
  return (
    <div>
      <button>Hello</button>
      <button>Hello</button>
      <button>Hello</button>
      <button>Hello</button>
      <button>Hello</button>
    </div>
  )
}

const app = <h1 style={{ color: 'blue' }}>Hello World</h1>

ReactDOM.render(app, document.getElementById('root'))`,
    focus: "1:7",
  },
  {
    code: `function MyComponent() {
  return (
    <div>
      <button>Bye</button>
      <button>Bye</button>
      <button>Bye</button>
    </div>
  )
}

const app = <h1 style={{ color: 'blue' }}>Hello World</h1>

ReactDOM.render(app, document.getElementById('root'))`,
    focus: "7",
  },
  {
    code: `const app = <h1 style={{ color: 'blue' }}>Hello World</h1>

ReactDOM.render(app, document.getElementById('root'))`,
    focus: "1",
  },
]

function CodeSandboxIcon() {
  return (
    <a
      style={{
        margin: "0 1em 0 1em",
        color: "inherit",
        minWidth: "1.3em",
      }}
      title="Open in CodeSandbox"
      href={"sandboxurl"}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.3em"
        width="1.3em"
        stroke="currentColor"
        fill="currentColor"
        viewBox="0 0 512 512"
        style={{ display: "block" }}
      >
        <path d="M234.4 452V267.5L75.6 176.1v105.2l72.7 42.2v79.1l86.1 49.4zm41.2 1.1l87.6-50.5v-81l73.2-42.4V175.3l-160.8 92.8v185zm139.6-313.2l-84.5-49-74.2 43.1-74.8-43.1-85.3 49.6 159.1 91.6 159.7-92.2zM34.4 384.7V129L256 0l221.6 128.4v255.9L256 512 34.4 384.7z"></path>
      </svg>
    </a>
  )
}
