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
