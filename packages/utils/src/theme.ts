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

export enum ColorName {
  CodeForeground,
  CodeBackground,
  EditorForeground,
  EditorBackground,
  ActiveTabBackground,
  ActiveTabForeground,
  InactiveTabBackground,
  InactiveTabForeground,
  EditorGroupBorder,
  EditorGroupHeaderBackground,
  TabBorder,
  ActiveTabBottomBorder,
  LineNumberForeground,
}

type Color = string | undefined

const contrastBorder = "#6FC3DF"

// defaults from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/common/theme.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/view/editorColorRegistry.ts
// keys from : https://code.visualstudio.com/api/references/theme-color#editor-groups-tabs
export function getColor(
  theme: EditorTheme,
  colorName: ColorName
): Color {
  const colors = theme.colors || {}
  switch (colorName) {
    case ColorName.CodeForeground:
      return (
        getGlobalSettings(theme)?.foreground ||
        getColor(theme, ColorName.EditorForeground)
      )
    case ColorName.CodeBackground:
      return (
        getGlobalSettings(theme)?.background ||
        getColor(theme, ColorName.EditorBackground)
      )
    case ColorName.EditorBackground:
      return (
        colors["editor.background"] ||
        getDefault(theme, {
          light: "#fffffe",
          dark: "#1E1E1E",
          hc: "#000000",
        })
      )
    case ColorName.EditorForeground:
      return (
        colors["editor.foreground"] ||
        getDefault(theme, {
          light: "#333333",
          dark: "#BBBBBB",
          hc: "#fffffe",
        })
      )
    case ColorName.ActiveTabBackground:
      return (
        colors["tab.activeBackground"] ||
        getColor(theme, ColorName.EditorBackground)
      )
    case ColorName.ActiveTabForeground:
      return (
        colors["tab.activeForeground"] ||
        getDefault(theme, {
          dark: "#ffffff",
          light: "#333333",
          hc: "#ffffff",
        })
      )
    case ColorName.InactiveTabBackground:
      return (
        colors["tab.inactiveBackground"] ||
        getDefault(theme, {
          dark: "#2D2D2D",
          light: "#ECECEC",
          hc: undefined,
        })
      )
    case ColorName.InactiveTabForeground:
      return (
        colors["tab.inactiveForeground"] ||
        getDefault(theme, {
          dark: transparent(
            getColor(theme, ColorName.ActiveTabForeground),
            0.5
          ),
          light: transparent(
            getColor(theme, ColorName.ActiveTabForeground),
            0.7
          ),
          hc: "#ffffff",
        })
      )
    case ColorName.TabBorder:
      return (
        colors["tab.border"] ||
        getDefault(theme, {
          dark: "#252526",
          light: "#F3F3F3",
          hc: contrastBorder,
        })
      )
    case ColorName.ActiveTabBottomBorder:
      return (
        colors["tab.activeBorder"] ||
        getColor(theme, ColorName.ActiveTabBackground)
      )
    case ColorName.EditorGroupBorder:
      return (
        colors["editorGroup.border"] ||
        getDefault(theme, {
          dark: "#444444",
          light: "#E7E7E7",
          hc: contrastBorder,
        })
      )
    case ColorName.EditorGroupHeaderBackground:
      return (
        colors["editorGroupHeader.tabsBackground"] ||
        getDefault(theme, {
          dark: "#252526",
          light: "#F3F3F3",
          hc: undefined,
        })
      )
    case ColorName.LineNumberForeground:
      return (
        colors["editorLineNumber.foreground"] ||
        getDefault(theme, {
          dark: "#858585",
          light: "#237893",
          hc: "#fffffe",
        })
      )

    default:
      return "#f00"
  }
}

function transparent(color: Color, opacity: number): Color {
  const _opacity = Math.round(
    Math.min(Math.max(opacity || 1, 0), 1) * 255
  )
  return !color
    ? color
    : color + _opacity.toString(16).toUpperCase()
}

function getDefault(
  theme: EditorTheme,
  defaults: { dark: Color; light: Color; hc: Color }
): Color {
  return defaults[getThemeType(theme)]
}

function getThemeType(
  theme: EditorTheme
): "dark" | "light" | "hc" {
  return (theme.type
    ? theme.type
    : theme.name?.toLowerCase().includes("light")
    ? "light"
    : "dark") as "dark" | "light" | "hc"
}

export function getCodeColors(
  theme: EditorTheme
): { fg: string; bg: string } {
  return {
    fg: getColor(theme, ColorName.CodeForeground)!,
    bg: getColor(theme, ColorName.CodeBackground)!,
  }
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
