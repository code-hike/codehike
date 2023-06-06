/**
 * A single theme setting.
 */
interface IRawThemeSetting {
  name?: string
  scope?: string | string[]
  settings: {
    fontStyle?: string
    foreground?: string
    background?: string
  }
}
/**
 * A TextMate theme.
 */
export interface EditorTheme {
  name?: string
  type?: string
  colors?: Record<string, string>

  // not used:
  tokenColors?: IRawThemeSetting[]
  settings?: IRawThemeSetting[]
  semanticTokenColors?: any
  semanticHighlighting?: boolean
}

type Color = string | undefined

function getDefault(
  theme: EditorTheme,
  defaults: { dark: Color; light: Color; hc: Color }
): Color {
  return defaults[getThemeType(theme)]
}

function getThemeType(
  theme: EditorTheme
): "dark" | "light" | "hc" {
  return (
    theme.type
      ? theme.type
      : theme.name?.toLowerCase().includes("light")
      ? "light"
      : "dark"
  ) as "dark" | "light" | "hc"
}

function getGlobalSettings(theme: EditorTheme) {
  let settings = theme.settings
    ? theme.settings
    : theme.tokenColors
  const globalSetting = settings
    ? settings.find(s => {
        return !s.name && !s.scope
      })
    : undefined
  return globalSetting?.settings
}
