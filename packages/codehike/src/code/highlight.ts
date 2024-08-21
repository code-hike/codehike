import { splitAnnotationsAndCode } from "./extract-annotations.js"
import {
  CodeAnnotation,
  RawCode,
  HighlightedCode,
  Token,
  Whitespace,
  isWhitespace,
} from "./types.js"
import {
  Lines,
  Tokens,
  highlight as lighter,
  LANG_NAMES,
  Theme,
} from "@code-hike/lighter"

type AnyToken = Token | Whitespace

export async function highlight(
  data: RawCode,
  theme: Theme,
  config: { annotationPrefix?: string } = {},
): Promise<HighlightedCode> {
  let { value, lang = "txt" } = data

  if (!LANG_NAMES.includes(lang)) {
    console.warn(`Code Hike warning: Unknown language "${lang}"`)
    lang = "txt"
  }

  const { code, annotations } = await splitAnnotationsAndCode(
    value,
    lang,
    config.annotationPrefix || "!",
  )
  const {
    lines,
    lang: lighterLang,
    style,
  } = await lighter(code, lang, theme as any, {
    annotations: [],
    scopes: false, // true for better token transitions, but breaks css themes
  })

  const tokens = joinLines(lines)
  // split surrounding whitespace for each token
  const splitTokens = splitWhitespace(tokens)
  // join consecutive whitespace tokens
  const joinedTokens = joinWhitespace(splitTokens)
  return {
    ...data,
    code,
    tokens: joinedTokens,
    lang: lighterLang,
    annotations: compatAnnotations(annotations),
    themeName: typeof theme === "string" ? theme : theme?.name || "unknown",
    style,
  }
}

function compatAnnotations(annotations: any[]): CodeAnnotation[] {
  const newAnnotations: CodeAnnotation[] = []
  for (const a of annotations) {
    const { name, query, ranges } = a
    for (const r of ranges) {
      if (r.lineNumber) {
        const { lineNumber, fromColumn, toColumn } = r
        newAnnotations.push({
          name,
          query,
          lineNumber,
          fromColumn,
          toColumn,
        })
      } else {
        const { fromLineNumber, toLineNumber } = r
        newAnnotations.push({
          name,
          query,
          fromLineNumber,
          toLineNumber,
        })
      }
    }
  }
  return newAnnotations
}

// group the Lines into one array
function joinLines(lines: Lines): AnyToken[] {
  const joinedTokens: AnyToken[] = []
  lines.forEach((lineOrGroup, i) => {
    if ("lines" in lineOrGroup) {
      throw new Error("Shouldnt be groups")
    } else {
      const tokens = joinTokens(lineOrGroup.tokens)
      joinedTokens.push(...tokens)
      if (i < lines.length - 1) {
        joinedTokens.push("\n")
      }
    }
  })
  return joinedTokens
}

function joinTokens(tokens: Tokens): AnyToken[] {
  return tokens.map((tokenOrGroup) => {
    if ("tokens" in tokenOrGroup) {
      throw new Error("Shouldnt be groups")
    } else {
      const t = [tokenOrGroup.content] as Token
      const { color, ...rest } = tokenOrGroup.style || {}
      t.push(color)
      if (Object.keys(rest).length) {
        t.push(rest)
      }
      return t
    }
  })
}

function splitWhitespace(tokens: AnyToken[]) {
  const ejected: AnyToken[] = []
  tokens.forEach((tokenOrGroup) => {
    if (isWhitespace(tokenOrGroup)) {
      ejected.push(tokenOrGroup)
    } else {
      const [before, content, after] = splitSurroundingWhitespace(
        tokenOrGroup[0],
      )
      if (before?.length) {
        ejected.push(before)
      }
      if (content.length) {
        const copy = [...tokenOrGroup] as Token
        copy[0] = content
        ejected.push(copy)
      }
      if (after?.length) {
        ejected.push(after)
      }
    }
  })
  return ejected
}

function joinWhitespace(tokens: AnyToken[]) {
  const joinedTokens: AnyToken[] = []
  tokens.forEach((tokenOrGroup) => {
    if (isWhitespace(tokenOrGroup)) {
      let last = joinedTokens[joinedTokens.length - 1]
      if (last && isWhitespace(last)) {
        joinedTokens[joinedTokens.length - 1] += tokenOrGroup
      } else if (tokenOrGroup !== "") {
        joinedTokens.push(tokenOrGroup)
      }
    } else if (tokenOrGroup[0].length > 0) {
      joinedTokens.push(tokenOrGroup)
    }
  })
  return joinedTokens
}

// splits " \t foo bar \n" into [" \t ","foo bar"," \n"]
// "foo bar" -> ["","foo bar",""]
function splitSurroundingWhitespace(content: string) {
  const trimmed = content.trim()
  const before = content.slice(0, content.indexOf(trimmed))
  const after = content.slice(content.indexOf(trimmed) + trimmed.length)
  return [before, trimmed, after]
}
