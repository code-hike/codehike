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
  map,
} from "@code-hike/utils"
import {
  getThemeDefaultColors,
  EditorTheme,
} from "./themes"

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
  theme: EditorTheme
): {
  lines: FullTween<CodeLine[]>
} {
  return useAsyncMemo(
    {
      isReady: isHighlighterReady(lang, theme),
      load: () => loadHighlighter(lang, theme),
      run: () => highlightSync(code, lang, theme),
      placeholder: () => {
        const lines = mapWithDefault(
          code,
          "",
          tokenizePlaceholder
        )
        return { lines }
      },
    },
    [code.prev, code.next, lang, theme]
  )
}

export function isHighlighterReady(
  lang: string,
  theme: EditorTheme
) {
  return (
    highlighter != null &&
    !missingTheme(highlighter, theme) &&
    !missingLang(highlighter, lang)
  )
}

export async function loadHighlighter(
  lang: string,
  theme: EditorTheme
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
}

export function highlightOrPlaceholder(
  code: string,
  lang: string,
  theme: EditorTheme
) {
  if (isHighlighterReady(lang, theme)) {
    return getCodeLines(highlighter!, code, lang, theme)
  } else {
    return tokenizePlaceholder(code)
  }
}

export async function highlight(
  code: Tween<string>,
  lang: string,
  theme: EditorTheme
) {
  await loadHighlighter(lang, theme)
  const { lines } = highlightSync(code, lang, theme)
  return map(lines, lines =>
    lines.map((line, i) => ({
      tokens: line.map(([content, props]) => ({
        content,
        props,
      })),
    }))
  )
}

function highlightSync(
  code: Tween<string>,
  lang: string,
  theme: EditorTheme
) {
  // assumes highlighter isReady

  const { fg, bg } = highlighter!.getTheme(theme.name)

  const lines = mapWithDefault(code, "", code =>
    getCodeLines(highlighter!, code, lang, theme)
  )

  return { lines, bg, fg }
}

function getCodeLines(
  highlighter: Highlighter,
  code: string,
  lang: string,
  theme: EditorTheme
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
  theme: EditorTheme
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

type ThemedCode = {
  lines: IThemedToken[][]
  fg: string
  bg: string
}

const newlineRe = /\r\n|\r|\n/
export function tokenizePlaceholder(
  code: string
): CodeLine[] {
  const lines = code.split(newlineRe)
  return lines.map(line => [[line, {}]])
}

export function getBasicThemedCode(
  code: string,
  theme: EditorTheme
): ThemedCode {
  const lines = code.split(newlineRe)
  const { fg, bg } = getThemeDefaultColors(theme)
  return {
    lines: lines.map(line => [{ content: line }]),
    fg,
    bg,
  }
}
