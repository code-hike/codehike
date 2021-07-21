import { IRawTheme } from "vscode-textmate"
import { IThemedToken } from "shiki"

type ThemedCode = {
  lines: IThemedToken[][]
  fg: string
  bg: string
}

type CodeToken = [
  string,
  {
    className?: string
    style?: { color: string | undefined }
  }
]
type CodeLine = CodeToken[]

export function tokenizePlaceholder(
  code: string
): CodeLine[] {
  const lines = code.split("\n")
  return lines.map(line => [[line, {}]])
}

export function getBasicThemedCode(
  code: string,
  theme: IRawTheme
): ThemedCode {
  const lines = code.split("\n")
  const { fg, bg } = getThemeDefaultColors(theme)
  return {
    lines: lines.map(line => [{ content: line }]),
    fg,
    bg,
  }
}

/**
 * From https://github.com/shikijs/shiki/blob/HEAD/packages/shiki/src/loader.ts
 */

const VSCODE_FALLBACK_EDITOR_FG = {
  light: "#333333",
  dark: "#bbbbbb",
}
const VSCODE_FALLBACK_EDITOR_BG = {
  light: "#fffffe",
  dark: "#1e1e1e",
}

function getThemeDefaultColors(
  theme: IRawTheme & { type?: string }
): { fg: string; bg: string } {
  let fg, bg

  /**
   * First try:
   * Theme might contain a global `tokenColor` without `name` or `scope`
   * Used as default value for foreground/background
   */
  let settings = theme.settings
    ? theme.settings
    : (<any>theme).tokenColors
  const globalSetting = settings
    ? settings.find((s: any) => {
        return !s.name && !s.scope
      })
    : undefined

  if (globalSetting?.settings?.foreground) {
    fg = globalSetting.settings.foreground
  }
  if (globalSetting?.settings?.background) {
    bg = globalSetting.settings.background
  }

  /**
   * Second try:
   * If there's no global `tokenColor` without `name` or `scope`
   * Use `editor.foreground` and `editor.background`
   */
  if (!fg && (<any>theme)?.colors?.["editor.foreground"]) {
    fg = (<any>theme).colors["editor.foreground"]
  }
  if (!bg && (<any>theme)?.colors?.["editor.background"]) {
    bg = (<any>theme).colors["editor.background"]
  }

  /**
   * Last try:
   * If there's no fg/bg color specified in theme, use default
   */
  if (!fg) {
    fg =
      theme.type === "light"
        ? VSCODE_FALLBACK_EDITOR_FG.light
        : VSCODE_FALLBACK_EDITOR_FG.dark
  }
  if (!bg) {
    bg =
      theme.type === "light"
        ? VSCODE_FALLBACK_EDITOR_BG.light
        : VSCODE_FALLBACK_EDITOR_BG.dark
  }

  return {
    fg,
    bg,
  }
}
