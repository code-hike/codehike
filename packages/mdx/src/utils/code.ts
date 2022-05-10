type HighlightedToken = {
  content: string
  props: { style?: React.CSSProperties }
}

type HighlightedLine = {
  tokens: HighlightedToken[]
}

export type Code = {
  lines: HighlightedLine[]
  lang: string
}

export function codeToText(code: Code) {
  return code.lines
    .map(line =>
      line.tokens.map(token => token.content).join("")
    )
    .join("\n")
}
