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

  const ps = prev.filter(
    t => t.style && t.style.position !== "absolute"
  )
  const ns = next.filter(t => t.style)

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

  let nextIds = []
  let pIndex = 0
  let deleted = {}

  result.forEach(part => {
    const { added, removed, count, value } = part
    if (added) {
      const before = ps[pIndex - 1]?.id
      const after = ps[pIndex]?.id

      for (let i = 0; i < count; i++) {
        nextIds.push(++highestId)
      }
    } else if (removed) {
      deleted[nextIds.length] = value.map(t => ({
        ...t,
        style: {
          ...t.style,
          position: "absolute",
          opacity: 0,
        },
      }))
      pIndex += count
    } else {
      value.forEach(_ => {
        nextIds.push(ps[pIndex++].id)
      })
    }
  })

  let nIndex = 0
  const nextTokens = deleted[0] || []
  next.forEach(token => {
    if (token.style) {
      nextTokens.push({ ...token, id: nextIds[nIndex++] })
      if (deleted[nIndex]) {
        nextTokens.push(...deleted[nIndex])
      }
    } else {
      nextTokens.push(token)
    }
  })

  // console.log("Before:")
  // console.table(
  //   ps.map(t => ({ id: t.id, content: t.content }))
  // )
  // console.log("After:")
  // console.table(
  //   nextTokens
  //     .filter(t => t.style)
  //     .map(t => ({ id: t.id, content: t.content }))
  // )

  // console.log(nextTokens)

  return nextTokens
}
