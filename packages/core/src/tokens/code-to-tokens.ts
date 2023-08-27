import {
  highlight,
  extractAnnotations,
  Theme,
  Lines,
  Tokens,
} from "@code-hike/lighter"
import { TokenOrGroup } from "../types"

const annotationNames = ["mark"]

export type TokenItem = TokenOrGroup
export type TokenList = TokenOrGroup[]

function joinTokens(tokens: Tokens): TokenOrGroup[] {
  return tokens.map(tokenOrGroup => {
    if ("tokens" in tokenOrGroup) {
      return {
        name: tokenOrGroup.annotationName,
        query: tokenOrGroup.annotationQuery,
        inline: true,
        tokens: joinTokens(tokenOrGroup.tokens),
      }
    } else {
      return tokenOrGroup
    }
  })
}

function joinLines(lines: Lines): TokenOrGroup[] {
  const joinedTokens: TokenOrGroup[] = []
  lines.forEach(lineOrGroup => {
    if ("lines" in lineOrGroup) {
      joinedTokens.push({
        name: lineOrGroup.annotationName,
        query: lineOrGroup.annotationQuery,
        inline: false,
        tokens: joinLines(lineOrGroup.lines),
      })
    } else {
      const tokens = joinTokens(lineOrGroup.tokens)
      joinedTokens.push(...tokens)
      joinedTokens.push({ content: "\n", style: undefined })
    }
  })
  return joinedTokens
}

function splitWhitespace(tokens: TokenOrGroup[]) {
  const ejected: TokenOrGroup[] = []
  tokens.forEach(tokenOrGroup => {
    if ("tokens" in tokenOrGroup) {
      ejected.push({
        ...tokenOrGroup,
        tokens: splitWhitespace(tokenOrGroup.tokens),
      })
    } else {
      const [before, content, after] =
        splitSurroundingWhitespace(tokenOrGroup.content)
      if (before?.length) {
        ejected.push({ content: before, style: undefined })
      }
      if (content.length) {
        ejected.push({ content, style: tokenOrGroup.style })
      }
      if (after?.length) {
        ejected.push({ content: after, style: undefined })
      }
    }
  })
  return ejected
}

function joinWhitespace(tokens: TokenOrGroup[]) {
  const joinedTokens: TokenOrGroup[] = []
  tokens.forEach(tokenOrGroup => {
    if ("tokens" in tokenOrGroup) {
      joinedTokens.push({
        ...tokenOrGroup,
        tokens: joinWhitespace(tokenOrGroup.tokens),
      })
    } else {
      const last = joinedTokens[joinedTokens.length - 1]
      if (
        last &&
        "style" in last &&
        !last.style &&
        !tokenOrGroup.style
      ) {
        last.content += tokenOrGroup.content
      } else if (tokenOrGroup.content === "") {
        // ignore empty tokens
      } else {
        joinedTokens.push(tokenOrGroup)
      }
    }
  })
  return joinedTokens
}

export async function tokenize(
  code: string,
  lang: string,
  theme: Theme
) {
  const { code: codeWithoutAnnotations, annotations } =
    await extractAnnotations(code, lang, annotationNames)

  const { lines } = await highlight(
    codeWithoutAnnotations,
    lang,
    theme,
    {
      scopes: true,
      annotations,
    }
  )
  const tokens = joinLines(lines)
  // split surrounding whitespace for each token
  const splitTokens = splitWhitespace(tokens)

  // join consecutive whitespace tokens
  const joinedTokens = joinWhitespace(splitTokens)

  return joinedTokens
}

// splits " \t foo bar \n" into [" \t ","foo bar"," \n"]
// "foo bar" -> ["","foo bar",""]
function splitSurroundingWhitespace(content: string) {
  const trimmed = content.trim()
  const before = content.slice(0, content.indexOf(trimmed))
  const after = content.slice(
    content.indexOf(trimmed) + trimmed.length
  )
  return [before, trimmed, after]
}
