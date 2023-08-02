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
    <main
      style={{ height: "100vh", background: "#0d1117" }}
    >
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
    </main>
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

const config = {
  removeDuration: 100,
  moveDuration: 300,
  addDuration: 500,
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

  const moved = []
  const added = []
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

    if (prevIndex === -1) {
      added.push({ span })
      return
    }

    const dx =
      prevSpanRect[prevIndex].dx -
      nextSpanRect[nextIndex].dx
    const dy =
      prevSpanRect[prevIndex].dy -
      nextSpanRect[nextIndex].dy
    moved.push({
      span,
      dx,
      dy,
      fromColor: prevSpanData[prevIndex].style.color,
      toColor: nextSpanData[nextIndex].style.color,
    })
  })

  const nextIds = nextSpanData.map(t => t.id)
  const removed = []
  prevSpanData.forEach((token, i) => {
    if (!nextIds.includes(token.id)) {
      const prevRect = prevSpanRect[i]
      const span = createSpan(token)
      span.style.setProperty("top", `${prevRect.dy}px`)
      span.style.setProperty("left", `${prevRect.dx}px`)
      span.style.setProperty("position", "absolute")
      parent.appendChild(span)
      removed.push({ span })
    }
  })

  const removeDuration = fullStaggerDuration(
    removed.length,
    config.removeDuration
  )
  const moveDuration = fullStaggerDuration(
    moved.length,
    config.moveDuration
  )
  const addDuration = fullStaggerDuration(
    added.length,
    config.addDuration
  )

  removed.forEach(({ span }, i) => {
    span.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: removeDuration,
      fill: "both",
      easing: "ease-out",
      delay: staggerDelay(
        i,
        removed.length,
        removeDuration,
        config.removeDuration
      ),
    })
  })

  moved.forEach(
    ({ span, dx, dy, fromColor, toColor }, i) => {
      const transform = `translateX(${dx}px) translateY(${dy}px)`
      span.animate(
        [
          { transform, color: fromColor },
          { transform: "none", color: toColor },
        ],
        {
          duration: config.moveDuration,
          fill: "both",
          easing: "ease-in-out",
          delay:
            removeDuration +
            staggerDelay(
              i,
              moved.length,
              moveDuration,
              config.moveDuration
            ),
        }
      )
    }
  )

  added.forEach(({ span }, i) => {
    span.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: config.addDuration,
      fill: "both",
      easing: "ease-in",
      delay:
        removeDuration +
        config.moveDuration +
        staggerDelay(
          i,
          added.length,
          addDuration,
          config.addDuration
        ),
    })
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

function fullStaggerDuration(count, singleDuration) {
  if (count === 0) return 0
  // return 2 * singleDuration * (1 - 1 / (1 + count))
  return 1.5 * singleDuration - 1 / (1 + count)
}

function staggerDelay(i, n, duration, singleDuration) {
  if (i === 0) return 0
  const max = duration - singleDuration
  console.log({ i, n, max })
  return (i / (n - 1)) * max
}
