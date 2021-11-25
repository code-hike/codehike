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

export const longCode = () => {
  const [code, setCode] = React.useState(null)

  React.useEffect(() => {
    highlight({
      code: largeCode,
      lang: "md",
      theme,
    }).then(code => setCode(code))
  }, [])

  const [stepIndex, setStepIndex] = React.useState(0)

  const focuses = ["1,7:14", "20:27", "33:37,53"]

  const step = {
    files: [
      {
        name: "index.js",
        code,
        focus: focuses[stepIndex % focuses.length],
        annotations: [],
      },
    ],
    northPanel: {
      tabs: ["index.js"],
      active: "index.js",
      heightRatio: 1,
    },
  }
  return (
    <Page>
      {code ? (
        <>
          <button
            onClick={() => setStepIndex(stepIndex + 1)}
          >
            Next
          </button>
          <EditorSpring
            {...step}
            codeConfig={{ theme, minZoom: 0.5 }}
            frameProps={{ style: { height: 400 } }}
          />
        </>
      ) : (
        "Loading..."
      )}
    </Page>
  )
}

function SingleEditor({
  inputCode,
  lang = "js",
  focus = "",
  annotations = [],
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
    <EditorSpring {...step} codeConfig={{ theme }} />
  ) : (
    "Loading..."
  )
}

const largeCode = `
# Hello World

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

## Basic syntax highlighting

~~~js
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit;
  dolor = sit - amet(dolor);
  return consectetur(ipsum);
}
~~~

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

## Focusing parts of the code

~~~js focus=2,4[10:38]
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit;
  dolor = sit - amet(dolor);
  return consectetur(ipsum);
}
~~~

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

## Multiple files together

<CH.Code>

~~~js index.js
function lorem(ipsum, dolor = 1) {
  sit = ipsum - amet(dolor);
  return sit;
}
~~~

---

~~~js index.css
.bar {
  height: 10px;
  width: 10px;
}
~~~

</CH.Code>

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

## Annotations

~~~js bg=2:3 box=5[16:26]
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit;
  dolor = sit - amet(dolor);
  return sit ? consectetur(ipsum) : [];
}
~~~

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

## And more annotations

~~~js focus=4,8
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null && 0;
  dolor = sit - amet(dolor);
  // link[16:26] https://github.com/code-hike/codehike
  return sit ? consectetur(ipsum) : [];
}

function adipiscing(...elit) {
  // label something something
  console.log("hover me");
  return elit.map((ipsum) => ipsum.sit);
}
~~~

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

## And even custom annotations

import { MyTooltipAnnotation } from "./MyTooltipAnnotation";

~~~js
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null && 0;
  dolor = sit - amet(dolor);
  return sit ? consectetur(ipsum) : [];
}

function adipiscing(...elit) {
  const sit = ipsum == null && 0;
  dolor = sit - amet(dolor);
  console.log(2);
  return elit.map((ipsum) => ipsum.sit);
}
~~~

<CH.Annotation as={MyTooltipAnnotation} focus="4[16:26]">

### Something

Lorem ipsum dolor sit amet, consectetur
adipiscing elit.

</CH.Annotation>

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

# Spotlight

<CH.Spotlight>

~~~js app.js
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null && 0;
  dolor = sit - amet(dolor);
  return sit ? consectetur(ipsum) : [];
}
~~~

---

Change focus

~~~js app.js focus=2:4

~~~

---

Or change the code

~~~js app.js focus=6:10
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null && 0;
  dolor = sit - amet(dolor);
  return sit ? consectetur(ipsum) : [];
}

function adipiscing(...elit) {
  console.log(elit);
  return elit.map((ipsum) => ipsum.sit);
}
~~~

---

Or change the file

~~~js app.js focus=1:4
function adipiscing(...elit) {
  console.log(elit);
  return elit.map((ipsum) => ipsum.sit);
}
~~~

</CH.Spotlight>

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.

## Scrollycoding

<CH.Scrollycoding 
  preset="https://codesandbox.io/s/zzgrb"
>

### Step 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel.

~~~jsx app.js focus=3:9
import Circle from "./circle";
const red = "hsl(0 85% 60%)";
export default function App() {
  return (
    <div>
      <Circle color={red} />
    </div>
  );
}
~~~

---

### Step 2

Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan.

~~~jsx app.js focus=5:9
import Circle from "./circle";
const red = "hsl(0 85% 60%)";
export default function App() {
  return (
    <div>
      <Circle color={red} />
      <Circle color={red} />
      <Circle color={red} />
    </div>
  );
}
~~~

---

### Step 3

At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel.

~~~jsx app.js focus=2,6:8

~~~

---

### Step 4

Egestas sed tempus urna et pharetra pharetra massa massa ultricies. Praesent elementum facilisis leo vel fringilla. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Lorem ipsum dolor sit amet.

~~~jsx app.js focus=8:10
import Circle from "./circle";
const red = "hsl(0 85% 60%)";
const blue = "hsl(240 50% 60%)";
const gold = "hsl(60 60% 60%)";
export default function App() {
  return (
    <div>
      <Circle color={red} />
      <Circle color={blue} />
      <Circle color={gold} />
    </div>
  );
}
~~~

</CH.Scrollycoding>

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Praesent elementum facilisis leo vel fringilla est ullamcorper eget. At imperdiet dui accumsan sit amet nulla facilities morbi tempus. Praesent elementum facilisis leo vel fringilla. Congue mauris rhoncus aenean vel. Egestas sed tempus urna et pharetra pharetra massa massa ultricies.
`.trim()
