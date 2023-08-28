import { diffArrays } from "diff"
import { Token } from "@code-hike/lighter"
import {
  TokenOrGroup,
  TokenWithId,
  TokenWithIdOrGroup,
  WhitespaceToken,
} from "./types"

export function withIds(
  tokens: TokenOrGroup[],
  start: number = 0
) {
  let id = start
  return tokens.map(tokenOrGroup => {
    if ("tokens" in tokenOrGroup) {
      const groupTokens = withIds(tokenOrGroup.tokens, id)
      id += groupTokens.length
      return {
        ...tokenOrGroup,
        tokens: groupTokens,
      }
    } else if (!tokenOrGroup.style) {
      return tokenOrGroup as WhitespaceToken
    }
    return {
      ...tokenOrGroup,
      id: id++,
    }
  })
}

export function diff(
  prev: TokenWithIdOrGroup[],
  next: TokenOrGroup[]
): TokenWithIdOrGroup[] {
  console.log({ next })
  if (!prev) {
    return withIds(next)
  }

  const ps = toOnlyTokens<TokenWithId>(prev as any)
  const ns = toOnlyTokens<Token>(next as any)

  const result = diffArrays(ps, ns, {
    comparator: (a, b) => a.content == b.content,
  })

  // highest id in ps
  let highestId = 0
  ps.forEach(t => {
    if (t.id > highestId) {
      highestId = t.id
    }
  })

  const tokensWithId: TokenWithId[] = []
  let nId = 0
  let pId = 0
  result.forEach(part => {
    const { added, removed, count, value } = part
    if (added) {
      for (let i = 0; i < count; i++) {
        tokensWithId.push({
          ...ns[nId++],
          id: ++highestId,
        })
      }
    } else if (removed) {
      value.forEach((t: TokenWithId) => {
        pId++
        tokensWithId.push({
          ...t,
          style: {
            ...t.style,
            position: "absolute",
            opacity: 0,
          },
          deleted: true,
        })
      })
    } else {
      value.forEach(_ => {
        tokensWithId.push({
          ...ns[nId++],
          id: ps[pId].id,
        })
        pId++
      })
    }
  })

  const tokens = replaceTokens(next, tokensWithId)

  return tokens
}

function replaceTokens(
  tokens: TokenOrGroup[],
  tokensWithId: TokenWithId[]
): TokenWithIdOrGroup[] {
  const result: TokenWithIdOrGroup[] = []

  tokens.forEach(tokenOrGroup => {
    if ("tokens" in tokenOrGroup) {
      result.push({
        ...tokenOrGroup,
        tokens: replaceTokens(
          tokenOrGroup.tokens,
          tokensWithId
        ),
      })
    } else if (!tokenOrGroup.style) {
      result.push(tokenOrGroup as WhitespaceToken)
    } else {
      while (
        tokensWithId[0]?.deleted ||
        (tokensWithId[0] && !tokensWithId[0]?.style)
      ) {
        result.push(tokensWithId.shift())
      }

      result.push(tokensWithId.shift())

      while (
        tokensWithId[0]?.deleted ||
        (tokensWithId[0] && !tokensWithId[0]?.style)
      ) {
        result.push(tokensWithId.shift())
      }
    }
  })

  return result
}

// flat annotations and ignore whitespace
function toOnlyTokens<T>(
  tokens: ({ tokens: T[] } | T)[]
): T[] {
  return (tokens as TokenOrGroup[]).flatMap(
    tokenOrGroup => {
      if ("tokens" in tokenOrGroup) {
        return toOnlyTokens(tokenOrGroup.tokens)
      }
      if (
        !tokenOrGroup.style ||
        // was deleted
        (tokenOrGroup as any).style?.position === "absolute"
      ) {
        return []
      }
      return [tokenOrGroup]
    }
  ) as T[]
}
