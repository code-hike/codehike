import React from "react"
import { diff } from "../src/differ"
import { animate } from "./flip-animate"

export function FlipCode({ tokens }) {
  const tokensWithIds = useTokensWithIds(tokens)
  return <Tokens tokens={tokensWithIds} />
}

function useTokensWithIds(tokens) {
  const prevRef = React.useRef()
  const result = React.useMemo(
    () => diff(prevRef.current, tokens),
    [tokens]
  )

  React.useEffect(() => {
    prevRef.current = result
  }, [result])

  return result
}

function Tokens({ tokens }) {
  return (
    <Flip>
      {tokens.map((token, i) =>
        token.style ? (
          <span
            style={{
              ...token.style,
              display: "inline-block",
              // willChange: "transform, opacity, color",
            }}
            key={token.id}
            ch-x={token.id}
          >
            {token.content}
          </span>
        ) : (
          // whitespace:
          token.content
        )
      )}
    </Flip>
  )
}

class Flip extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const snapshot = getSnapshot(this.ref.current)
    return snapshot
  }

  componentDidUpdate(prevProps, prevState, firstSnapshot) {
    const parent = this.ref.current
    const elements = parent.querySelectorAll("[ch-x]")

    // stop all animations
    elements.forEach(el => {
      el.getAnimations().forEach(a => {
        a.cancel()
      })
    })

    const lastSnapshot = getSnapshot(parent)
    animate(elements, firstSnapshot, lastSnapshot)
  }

  render() {
    return (
      <pre
        ref={this.ref}
        style={{
          padding: "1rem",
          width: "600px",
          margin: "2rem auto",
          position: "relative",
          lineHeight: "1.3",
          fontSize: "1.1rem",
        }}
      >
        {this.props.children}
      </pre>
    )
  }
}

function getSnapshot(parent) {
  const snapshot = {}
  parent.querySelectorAll("[ch-x]").forEach(el => {
    const id = el.getAttribute("ch-x")
    const { x, y } = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    const opacity = Number(style.opacity) ?? 1
    const color = style.color

    snapshot[id] = { x, y, opacity, color }
  })
  return snapshot
}
