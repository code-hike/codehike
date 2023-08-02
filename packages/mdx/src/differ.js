import {
  highlight,
  highlightSync,
} from "@code-hike/lighter"
import { diffArrays } from "diff"

export function tokenizeSync(code, lang, theme) {
  const { lines } = highlightSync(code, lang, theme, {
    scopes: true,
  })
  const tokens = lines.flatMap(line => [
    ...line,
    { content: "\n" },
  ])
  // split trimming whitespace for each token
  const splitTokens = tokens.flatMap(token => {
    const [before, content, after] =
      splitTrimmingWhitespace(token.content)
    return [
      before?.length && { content: before },
      { content, style: token.style },
      after?.length && { content: after },
    ].filter(Boolean)
  })

  // join whitespace tokens
  const joinedTokens = []
  splitTokens.forEach(token => {
    const last = joinedTokens[joinedTokens.length - 1]
    if (last && !last.style && !token.style) {
      last.content += token.content
    } else if (token.content === "") {
      // ignore empty tokens
    } else {
      if (token.style == null) {
        delete token.style
      }
      joinedTokens.push(token)
    }
  })

  return joinedTokens
}

export async function tokenize(code, lang, theme) {
  const { lines } = await highlight(code, lang, theme, {
    scopes: true,
  })
  const tokens = lines.flatMap(line => [
    ...line,
    { content: "\n" },
  ])
  // split trimming whitespace for each token
  const splitTokens = tokens.flatMap(token => {
    const [before, content, after] =
      splitTrimmingWhitespace(token.content)
    return [
      before?.length && { content: before },
      { content, style: token.style },
      after?.length && { content: after },
    ].filter(Boolean)
  })

  // join whitespace tokens
  const joinedTokens = []
  splitTokens.forEach(token => {
    const last = joinedTokens[joinedTokens.length - 1]
    if (last && !last.style && !token.style) {
      last.content += token.content
    } else if (token.content === "") {
      // ignore empty tokens
    } else {
      if (token.style == null) {
        delete token.style
      }
      joinedTokens.push(token)
    }
  })

  return joinedTokens
}

// splitTrimmingWhitespace(" \t foo bar \n") should return [" \t ","foo bar"," \n"]
function splitTrimmingWhitespace(content) {
  const trimmed = content.trim()
  const before = content.slice(0, content.indexOf(trimmed))
  const after = content.slice(
    content.indexOf(trimmed) + trimmed.length
  )
  return [before, trimmed, after]
}

export function withIds(tokens) {
  let id = 0
  return tokens.map(token =>
    token.style ? { ...token, id: id++ } : token
  )
}

export function diff(prev, next) {
  if (!prev) {
    return withIds(next)
  }

  const ps = prev.filter(t => t.style)
  const ns = next.filter(t => t.style)

  const result = diffArrays(ps, ns, {
    comparator: (a, b) => a.content == b.content,
  })

  let nextIds = []
  let pIndex = 0

  result.forEach(part => {
    const { added, removed, count, value } = part
    console.log(part)
    if (added) {
      const before = ps[pIndex - 1]?.id
      const after = ps[pIndex]?.id
      nextIds = nextIds.concat(getIds(before, after, count))
    } else if (removed) {
      pIndex += count
    } else {
      value.forEach(_ => {
        nextIds.push(ps[pIndex++].id)
      })
    }
  })

  let nIndex = 0
  const nextTokens = next.map(token => {
    if (token.style) {
      return { ...token, id: nextIds[nIndex++] }
    } else {
      return token
    }
  })
  return nextTokens
}

// n numbers between before and after (exclusive)
function getIds(before, after, n) {
  let b = before == null ? after - 1 : before
  let a = after == null ? before + 1 : after
  const ids = []
  for (let i = 0; i < n; i++) {
    ids.push(b + (a - b) * ((i + 1) / (n + 1)))
  }
  return ids
}
