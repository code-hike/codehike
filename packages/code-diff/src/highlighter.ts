import { IRawTheme } from "vscode-textmate"
import {
  getBasicThemedCode,
  tokenizePlaceholder,
} from "./placeholder"
import {
  Highlighter,
  setCDN,
  getHighlighter,
  IShikiTheme,
  IThemedToken,
  FontStyle,
  Lang,
} from "shiki"
import { useAsyncMemo } from "./use-async-memo"
import {
  Tween,
  FullTween,
  mapWithDefault,
} from "@code-hike/utils"

type CodeToken = [
  string,
  {
    className?: string
    style?: { color: string | undefined }
  }
]
type CodeLine = CodeToken[]

let highlighterPromise: Promise<Highlighter> | null = null
let highlighter: Highlighter | null = null

export function useHighlighter(
  code: Tween<string>,
  lang: string,
  theme: IRawTheme
): {
  lines: FullTween<CodeLine[]>
  bg: string
  fg: string
} {
  return useAsyncMemo(
    {
      loader: () => highlight(code, lang, theme),
      placeholder: () => {
        const { bg, fg } = getBasicThemedCode("", theme)
        const lines = mapWithDefault(
          code,
          "",
          tokenizePlaceholder
        )
        return { lines, bg, fg }
      },
    },
    [code.prev, code.next, lang, theme]
  )
}

async function highlight(
  code: Tween<string>,
  lang: string,
  theme: IRawTheme
) {
  if (highlighterPromise === null) {
    setCDN("https://unpkg.com/shiki/")
    highlighterPromise = getHighlighter({
      theme: theme as IShikiTheme,
      langs: [lang as Lang], // TODO change lang from string to Lang
    })
  }

  if (highlighter === null) {
    highlighter = await highlighterPromise
  }
  if (missingTheme(highlighter, theme)) {
    await highlighter.loadTheme(theme as IShikiTheme)
  }
  if (missingLang(highlighter, lang)) {
    await highlighter.loadLanguage(lang as Lang)
  }

  const { fg, bg } = highlighter.getTheme(theme.name)

  const lines = mapWithDefault(code, "", code =>
    getCodeLines(highlighter!, code, lang, theme)
  )

  return { lines, bg, fg }
}

function getCodeLines(
  highlighter: Highlighter,
  code: string,
  lang: string,
  theme: IRawTheme
): CodeLine[] {
  const lines = highlighter.codeToThemedTokens(
    code,
    lang,
    theme.name,
    {
      includeExplanation: false,
    }
  )

  return lines.map(line =>
    line.map(token => [
      token.content,
      { style: getStyle(token) },
    ])
  )
}

function missingTheme(
  highlighter: Highlighter,
  theme: IRawTheme
) {
  return !highlighter
    .getLoadedThemes()
    .some(t => t === theme.name)
}

function missingLang(
  highlighter: Highlighter,
  lang: string
) {
  return !highlighter
    .getLoadedLanguages()
    .some(l => l === lang)
}

const FONT_STYLE_TO_CSS = {
  [FontStyle.NotSet]: {},
  [FontStyle.None]: {},
  [FontStyle.Italic]: { fontStyle: "italic" },
  [FontStyle.Bold]: { fontWeight: "bold" },
  [FontStyle.Underline]: { textDecoration: "underline" },
}

function getStyle(token: IThemedToken) {
  const fontStyle = token.fontStyle
    ? FONT_STYLE_TO_CSS[token.fontStyle]
    : {}
  return {
    color: token.color,
    ...fontStyle,
  }
}
