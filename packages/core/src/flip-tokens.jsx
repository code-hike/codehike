"use-client"

import React from "react"
import { diff } from "./differ"
import { Flip } from "./flip"

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
