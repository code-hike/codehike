import React from "react"
import { MiniEditor } from "@code-hike/mini-editor"
import { Page, WithProgress } from "./utils"
import "@code-hike/mini-editor/dist/index.css"

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
console.log(10000000000000000, 100000000000000)
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
          <MiniEditor
            style={{ height: 300 }}
            lang="js"
            steps={steps}
            progress={progress}
            minColumns={5}
            file="index.js"
          />
          <p>minColumns 80</p>
          <MiniEditor
            style={{ height: 300 }}
            lang="js"
            steps={steps}
            progress={progress}
            backward={backward}
            minColumns={80}
            file="index.js"
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

export const withButton = () => {
  return (
    <Page>
      <MiniEditor
        style={{ height: 200 }}
        lang="js"
        file="index.js"
        steps={[{ code: code1 }]}
        progress={0}
        button={<CodeSandboxIcon />}
      />
    </Page>
  )
}

function CodeSandboxIcon() {
  return (
    <a
      style={{ margin: "0 1em 0 1em", color: "inherit" }}
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

export const manyTabs = () => {
  return (
    <Page>
      <h2>Three tabs</h2>
      <MiniEditor
        style={{ height: 200 }}
        lang="js"
        file="index.js"
        steps={[{ code: code1 }]}
        progress={0}
        tabs={["index.js", "two.css", "three.html"]}
      />
      <h2>With button</h2>
      <MiniEditor
        style={{ height: 200 }}
        lang="js"
        file="index.js"
        steps={[{ code: code1 }]}
        progress={0}
        tabs={["index.js", "two.css", "three.html"]}
        button={<CodeSandboxIcon />}
      />
      <h2>Long name</h2>
      <MiniEditor
        style={{ height: 200 }}
        lang="js"
        file="index-with-long-name.js"
        steps={[{ code: code1 }]}
        progress={0}
        tabs={[
          "index-with-long-name.js",
          "two.css",
          "three.html",
        ]}
        button={<CodeSandboxIcon />}
      />
      <h2>Six tabs</h2>
      <MiniEditor
        style={{ height: 200 }}
        lang="js"
        file="two.js"
        steps={[{ code: code1 }]}
        progress={0}
        tabs={[
          "index.js",
          "two.js",
          "three.html",
          "four.js",
          "five.css",
          "six.html",
        ]}
        button={<CodeSandboxIcon />}
      />
    </Page>
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
