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
  console.log(tokens)
  return (
    <pre
      style={{
        color: "#c9d1d9",
        background: "#0d1117",
        padding: "1rem",
        width: "600px",
        margin: "2rem auto",
      }}
      ref={ref}
    >
      {tokens.map(token =>
        token.style ? (
          <span
            style={token.style}
            key={token.id}
            id={token.id}
          >
            {token.content}
          </span>
        ) : (
          token.content
        )
      )}
    </pre>
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
