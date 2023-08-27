"use-client"

import React from "react"
import { diff } from "./differ"
import { Flip } from "./flip"
import { TokenOrGroup, TokenWithIdOrGroup } from "./types"

export function FlipCode({
  tokens,
}: {
  tokens: TokenOrGroup[]
}) {
  const tokensWithIds = useTokensWithIds(tokens)
  return <Tokens tokens={tokensWithIds} />
}

function useTokensWithIds(
  tokens: TokenOrGroup[]
): TokenWithIdOrGroup[] {
  const prevRef = React.useRef<TokenWithIdOrGroup[]>()
  const result = React.useMemo(
    () => diff(prevRef.current, tokens),
    [tokens]
  )

  React.useEffect(() => {
    prevRef.current = result
  }, [result])

  console.log({ result })

  return result
}

function Tokens({
  tokens,
}: {
  tokens: TokenWithIdOrGroup[]
}) {
  return (
    <Flip>
      {tokens.map((token, i) => (
        <TokenOrGroup token={token} key={i} />
      ))}
    </Flip>
  )
}

function TokenOrGroup({
  token,
}: {
  token: TokenWithIdOrGroup
}) {
  if ("tokens" in token) {
    return (
      <span>
        {token.tokens.map((token, i) => (
          <TokenOrGroup token={token} key={i} />
        ))}
      </span>
    )
  }

  return token.style ? (
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
    <>{token.content}</>
  )
}
