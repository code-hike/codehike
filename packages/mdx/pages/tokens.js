import React from "react"
import { diff, tokenize, withIds } from "../src/differ"

export async function getStaticProps() {
  const versions = await Promise.all(
    code.map(async code => {
      const result = await tokenize(
        code,
        "jsx",
        "github-dark"
      )
      return result
    })
  )
  return { props: { versions } }
}

export default function Home({ versions }) {
  const [selected, setSelected] = React.useState(
    versions[0]
  )
  return (
    <>
      <nav
        style={{ margin: "0 auto", textAlign: "center" }}
      >
        {versions.map((_, i) => {
          return (
            <button
              key={i}
              onClick={() => setSelected(versions[i])}
            >
              {i + 1}
            </button>
          )
        })}
      </nav>
      <Code tokens={selected} />
    </>
  )
}

function Code({ tokens }) {
  const tokensWithIds = withIds(tokens)
  const prevTokens = usePrevProps(tokensWithIds)
  return (
    <CodeTransition
      currentTokens={tokensWithIds}
      previousTokens={prevTokens}
    />
  )
}

function CodeTransition({ currentTokens, previousTokens }) {
  const ref = React.useRef()
  let tokens = currentTokens
  if (previousTokens) {
    const result = diff(previousTokens, currentTokens)
    tokens = result
  }

  React.useLayoutEffect(() => {
    setTokens(ref.current, previousTokens, tokens)
  }, [currentTokens])

  return (
    <pre
      style={{
        color: "#c9d1d9",
        background: "#0d1117",
        padding: "1rem",
        width: "600px",
        margin: "2rem auto",
        position: "relative",
      }}
      ref={ref}
    />
  )
}

// prettier-ignore
const code = [`
import React from "react"

const app = React.createElement(
  "h1",
  { style: { color: "teal" } },
  "Hello React"
)

ReactDOM.render(app, document.getElementById("root"))
`.trim(),`
import React from "react"
import ReactDOM from "react-dom"

const app = <h1 style={{ color: "teal" }}>Hello React</h1>

ReactDOM.render(app, document.getElementById("root"))
`.trim(),`
import React from "react"
import ReactDOM from "react-dom"

const app = (
  <h1 style={{ color: "teal" }}>
    Hello React
  </h1>
)

ReactDOM.render(app, document.getElementById("root"))
`.trim(),
]

function usePrevProps(props) {
  const ref = React.useRef()
  React.useEffect(() => {
    ref.current = props
  })
  return ref.current
}

function initTokens(parent, tokens) {
  parent.innerHTML = ""
  tokens.forEach((token, i) => {
    parent.appendChild(createSpan(token))
  })
}

function setTokens(parent, prevTokens, nextTokens) {
  if (!prevTokens) {
    initTokens(parent, nextTokens)
    return
  }

  const prevSpanData = prevTokens.filter(t => t.style)
  const nextSpanData = nextTokens.filter(t => t.style)
  // console.log({ prevSpanData, nextSpanData })

  const prevSpanRect = []
  const { x: parentX, y: parentY } =
    parent.getBoundingClientRect()

  parent.childNodes.forEach(span => {
    if (span.tagName !== "SPAN") return
    const rect = span.getBoundingClientRect()
    prevSpanRect.push({
      dx: rect.x - parentX,
      dy: rect.y - parentY,
    })
  })

  initTokens(parent, nextTokens)

  const nextSpanRect = []
  parent.childNodes.forEach(span => {
    if (span.tagName !== "SPAN") return
    const rect = span.getBoundingClientRect()

    nextSpanRect.push({
      dx: rect.x - parentX,
      dy: rect.y - parentY,
    })
  })

  // console.log({ prevSpanRect, nextSpanRect })

  // change styles
  parent.childNodes.forEach(span => {
    if (span.tagName !== "SPAN") return
    const id = Number(span.getAttribute("id"))
    const prevIndex = prevSpanData.findIndex(
      t => t.id === id
    )
    const nextIndex = nextSpanData.findIndex(
      t => t.id === id
    )
    // console.log({ id, prevIndex, nextIndex })

    if (prevIndex === -1) {
      // console.log("+", nextSpanData[nextIndex].content)
      span.style.setProperty("opacity", "0.1")
      return
    }
    // console.log("=", nextSpanData[nextIndex].content)

    const dx =
      prevSpanRect[prevIndex].dx -
      nextSpanRect[nextIndex].dx
    const dy =
      prevSpanRect[prevIndex].dy -
      nextSpanRect[nextIndex].dy
    span.style.setProperty(
      "transform",
      `translateX(${dx}px) translateY(${dy}px)`
    )
  })

  const nextIds = nextSpanData.map(t => t.id)
  // add removed tokens
  prevSpanData.forEach((token, i) => {
    if (!nextIds.includes(token.id)) {
      const prevRect = prevSpanRect[i]

      const span = createSpan(token)
      span.style.setProperty("top", `${prevRect.dy}px`)
      span.style.setProperty("left", `${prevRect.dx}px`)
      span.style.setProperty("position", "absolute")
      parent.appendChild(span)
    }
  })
}

function createSpan(token) {
  if (!token.style) {
    return document.createTextNode(token.content)
  }
  const span = document.createElement("span")
  span.textContent = token.content

  // set id
  span.setAttribute("id", token.id)

  // set style
  Object.entries(token.style).forEach(([key, value]) => {
    span.style.setProperty(key, value)
  })
  span.style.setProperty("display", "inline-block")
  return span
}
