import {
  highlight,
  extractAnnotations,
} from "@code-hike/lighter"

export async function tokenize(code, lang, theme) {
  const { code: codeWithoutAnnotations, annotations } =
    await extractAnnotations(code, lang, ["mark"])
  const { lines } = await highlight(
    codeWithoutAnnotations,
    lang,
    theme,
    {
      scopes: true,
    }
  )
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
