import React from "react"
import { Page } from "./utils"
import { CodeSpring } from "@code-hike/smooth-code"
import theme from "shiki/themes/github-light.json"
import { highlight } from "@code-hike/highlighter"
import "@code-hike/mdx/dist/index.css"
import "./assets/styles.css"

export default {
  title: "Test/Code Spring",
  argTypes: {
    center: { control: "boolean" },
    containerWidth: {
      control: {
        type: "range",
        min: 100,
        max: 200,
        step: 1,
      },
      defaultValue: 150,
    },
  },
}

export const basic = ({ center }) => {
  const prevCode = `
console.log(1)
console.log(2)
console.log(3)
`.trim()

  const nextCode = `
console.log(1)
console.log(3)
const x = (y) => y++
`.trim()

  const prevAnnotations = [
    { focus: "1[10:11],2[1:5]" },
    { focus: "3[8]" },
  ]

  const nextAnnotations = [
    { focus: "1[6:10]" },
    { focus: "2[1:5]" },
  ]
  const [steps, setSteps] = React.useState(null)
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    Promise.all([
      highlight({ code: prevCode, lang: "js", theme }),
      highlight({ code: nextCode, lang: "js", theme }),
    ]).then(([prevCode, nextCode]) =>
      setSteps([
        {
          code: prevCode,
          focus: "1",
          annotations: prevAnnotations,
        },
        {
          code: nextCode,
          focus: "2",
          annotations: nextAnnotations,
        },
      ])
    )
  }, [])

  return (
    <Page>
      <button onClick={() => setIndex((index + 1) % 2)}>
        Change
      </button>
      <div
        style={{ height: 300, outline: "1px solid red" }}
      >
        {steps ? (
          <CodeSpring
            step={steps[index]}
            config={{
              horizontalCenter: center,
              theme,
            }}
            style={{
              minHeight: "100%",
              fontSize: "2rem",
            }}
          />
        ) : (
          "Loading..."
        )}
      </div>
    </Page>
  )
}

function useStep(code, lang, focus, annotations = []) {
  const [step, setStep] = React.useState(null)
  React.useEffect(() => {
    highlight({ code, lang, theme }).then(hcode =>
      setStep({
        code: hcode,
        focus,
        annotations,
      })
    )
  }, [])
  return step
}

export const flow = ({}) => {
  const code = `console.log(10)`
  const step = useStep(code, "js", "1")

  return (
    <Page>
      <div
        className="longer"
        style={{ outline: "1px solid red" }}
      >
        {step ? (
          <CodeSpring step={step} config={{ theme }} />
        ) : (
          "Loading..."
        )}
      </div>
    </Page>
  )
}

export const flex = ({}) => {
  const code = `console.log(10)`
  const step = useStep(code, "js", "1")

  return (
    <Page>
      <div
        style={{
          display: "flex",
          height: 400,
        }}
      >
        {step ? (
          <CodeSpring
            step={step}
            style={{ height: "100%", flex: 2 }}
            config={{ theme }}
          />
        ) : (
          "Loading..."
        )}
        {step ? (
          <CodeSpring
            step={step}
            style={{ height: "100%", flex: 2 }}
            config={{ minZoom: 0.5, theme }}
          />
        ) : (
          "Loading..."
        )}
      </div>
    </Page>
  )
}

export const longer = ({}) => {
  const step = useStep(mdx, "md", "2:8")

  return (
    <Page>
      <div
        className="longer"
        style={{
          height: 320,
          width: 372,
          outline: "1px solid red",
          borderRadius: "0.25rem",
        }}
      >
        {step ? (
          <CodeSpring
            step={step}
            config={{ theme, minZoom: 0.5 }}
            style={{ height: "100%" }}
          />
        ) : (
          "Loading..."
        )}
      </div>
    </Page>
  )
}

const mdx = `import { Code } from "@code-hike/mdx"

# Hello

~~~js index.js
function lorem(ipsum, dolor = 1) {}
~~~

---

~~~js index.js
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit
  dolor = sit - amet(dolor)
  return sit
    ? consectetur(ipsum, 0, dolor < 0 ? 0 : dolor)
    : []
}
~~~

---

~~~js index.js focus=9:15
function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit
  dolor = sit - amet(dolor)
  return sit
    ? consectetur(ipsum, 0, dolor < 0 ? 0 : dolor)
    : []
}

function adipiscing(...elit) {
  if (!elit.sit) {
    return []
  }

  const sed = elit[0]
  return eiusmod.tempor(sed) ? sed : [sed]
}
~~~

## Hi

~~~py
def hello():
  print("Hello")
~~~

---

~~~py focus=4:6
def hello_1():
  print("Hello")

def hello_2():
  print("Hello")
  pring("World")

def hello_3():
  print("Hello")
~~~
`
