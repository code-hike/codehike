import { transparent } from "../color"

export type ThemeColors = ReturnType<typeof getThemeColors>

export function getThemeColors(theme: FinalTheme) {
  return {
    colorScheme:
      theme.type === "from-css"
        ? "var(--ch-0)"
        : theme.type,
  }
}

export function getColor(theme: FinalTheme, name: string) {
  const colors = theme.colors || {}
  if (colors[name]) {
    return colors[name]
  }

  const defaultColors = defaults[name]
  if (typeof defaultColors === "string") {
    return getColor(theme, defaultColors)
  }

  return getDefault(theme, defaultColors)
}

function getDefault(theme: FinalTheme, defaults) {
  const defaultByScheme = defaults[theme.type]
  if (Array.isArray(defaultByScheme)) {
    const [fn, name, ...args] = defaultByScheme
    const color = getColor(theme, name)
    return fn(color, ...args)
  }
  return defaultByScheme
}

// defaults from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/common/theme.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/core/editorColorRegistry.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts
// keys from : https://code.visualstudio.com/api/references/theme-color#editor-groups-tabs
const contrastBorder = "#6FC3DF"
const defaults = {
  "editor.foreground": {
    dark: "#bbbbbb",
    light: "#333333",
    hc: "#ffffff",
  },
  "editorLineNumber.foreground": {
    dark: "#858585",
    light: "#237893",
    hc: "#fffffe",
  },
  "editor.selectionBackground": {
    light: "#ADD6FF",
    dark: "#264F78",
    hc: "#f3f518",
  },
  "editor.background": {
    light: "#fffffe",
    dark: "#1E1E1E",
    hc: "#000000",
  },
  "editorGroupHeader.tabsBackground": {
    dark: "#252526",
    light: "#F3F3F3",
    hc: undefined,
  },
  "tab.activeBackground": "editor.background",
  "tab.activeForeground": {
    dark: "#ffffff",
    light: "#333333",
    hc: "#ffffff",
  },
  "tab.border": {
    dark: "#252526",
    light: "#F3F3F3",
    hc: contrastBorder,
  },
  "tab.activeBorder": "tab.activeBackground",
  "tab.inactiveBackground": {
    dark: "#2D2D2D",
    light: "#ECECEC",
    hc: undefined,
  },
  "tab.inactiveForeground": {
    dark: [transparent, "tab.activeForeground", 0.5],
    light: [transparent, "tab.activeForeground", 0.5],
    hc: "#ffffff",
  },
  "diffEditor.insertedTextBackground": {
    dark: "#9ccc2c33",
    light: "#9ccc2c40",
    hc: undefined,
  },
  "diffEditor.removedTextBackground": {
    dark: "#ff000033",
    light: "#ff000033",
    hc: undefined,
  },
  "diffEditor.insertedLineBackground": {
    dark: "#9bb95533",
    light: "#9bb95533",
    hc: undefined,
  },
  "diffEditor.removedLineBackground": {
    dark: "#ff000033",
    light: "#ff000033",
    hc: undefined,
  },
  "icon.foreground": {
    dark: "#C5C5C5",
    light: "#424242",
    hc: "#FFFFFF",
  },
  "sideBar.background": {
    dark: "#252526",
    light: "#F3F3F3",
    hc: "#000000",
  },
  "sideBar.foreground": "editor.foreground",
  "sideBar.border": "sideBar.background",
  "list.inactiveSelectionBackground": {
    dark: "#37373D",
    light: "#E4E6F1",
  },
  "list.inactiveSelectionForeground": {
    dark: undefined,
    light: undefined,
  },
  "list.hoverBackground": {
    dark: "#2A2D2E",
    light: "#F0F0F0",
  },
  "list.hoverForeground": {
    dark: undefined,
    light: undefined,
  },
  "editorGroupHeader.tabsBorder": { hc: contrastBorder },
  "tab.activeBorderTop": { hc: contrastBorder },
  "tab.hoverBackground": "tab.inactiveBackground",
  "tab.hoverForeground": "tab.inactiveForeground",
}

const themeCache = new Map<StringTheme, RawTheme>()

export function getTheme(theme: Theme): FinalTheme {
  let rawTheme = null
  if (typeof theme === "string") {
    rawTheme = themeCache.get(theme)
    if (!rawTheme) {
      throw new Error(
        "Syntax highlighting error: theme not loaded"
      )
    }
  } else {
    rawTheme = theme
  }
  return toFinalTheme(rawTheme)
}

function toFinalTheme(
  theme: RawTheme | undefined
): FinalTheme | undefined {
  if (!theme) {
    return undefined
  }

  const finalTheme: FinalTheme = {
    ...theme,
    name: theme.name || "unknown-theme",
    type: getColorScheme(theme),
    settings: theme.settings || theme.tokenColors || [],
    colors: theme.colors || {},
    colorNames: theme.colorNames,
  }

  const globalSetting = finalTheme.settings.find(
    s => !s.name && !s.scope
  )
  if (globalSetting) {
    const { foreground, background } =
      globalSetting.settings || {}
    const newColors = {}
    if (
      foreground &&
      !finalTheme.colors["editor.foreground"]
    ) {
      newColors["editor.foreground"] = foreground
    }
    if (
      background &&
      !finalTheme.colors["editor.background"]
    ) {
      newColors["editor.background"] = background
    }
    if (Object.keys(newColors).length > 0) {
      finalTheme.colors = {
        ...finalTheme.colors,
        ...newColors,
      }
    }
  }
  if (!globalSetting) {
    finalTheme.settings = [
      {
        settings: {
          foreground: getColor(
            finalTheme,
            "editor.foreground"
          ),
          background: getColor(
            finalTheme,
            "editor.background"
          ),
        },
      },
      ...finalTheme.settings,
    ]
  }

  if (theme.type === "from-css" && !finalTheme.colorNames) {
    const colorNames = {}
    let counter = 0

    finalTheme.settings = finalTheme.settings.map(s => {
      const setting = { ...s, settings: { ...s.settings } }
      const { foreground, background } =
        setting.settings || {}
      if (foreground && !colorNames[foreground]) {
        colorNames[foreground] = `#${counter
          .toString(16)
          .padStart(6, "0")}`
        counter++
      }
      if (background && !colorNames[background]) {
        colorNames[background] = `#${counter
          .toString(16)
          .padStart(6, "0")}`
        counter++
      }
      if (foreground) {
        setting.settings.foreground = colorNames[foreground]
      }
      if (background) {
        setting.settings.background = colorNames[background]
      }
      return setting
    })

    finalTheme.colorNames = colorNames
  }

  return finalTheme
}

function getColorScheme(theme: RawTheme) {
  if (theme.type === "from-css") {
    return "from-css"
  }
  const themeType = theme.type
    ? theme.type
    : theme.name?.toLowerCase().includes("light")
    ? "light"
    : "dark"
  if (themeType === "light") {
    return "light"
  } else {
    return "dark"
  }
}

export type RawTheme = {
  name?: string
  type?: string
  tokenColors?: ThemeSetting[]
  colors?: { [key: string]: string }
  [key: string]: any
}

type ThemeSetting = {
  name?: string
  scope?: string | string[]
  settings: {
    fontStyle?: string
    foreground?: string
    background?: string
  }
}

export type FinalTheme = {
  name: string
  type: "dark" | "light" | "from-css"
  settings: ThemeSetting[]
  colors: { [key: string]: string }
  colorNames?: { [key: string]: string }
}

export const THEME_NAMES = [
  "dark-plus",
  "dracula-soft",
  "dracula",
  "github-dark",
  "github-dark-dimmed",
  "github-from-css",
  "github-light",
  "light-plus",
  "material-darker",
  "material-default",
  "material-from-css",
  "material-lighter",
  "material-ocean",
  "material-palenight",
  "min-dark",
  "min-light",
  "monokai",
  "nord",
  "one-dark-pro",
  "poimandres",
  "slack-dark",
  "slack-ochin",
  "solarized-dark",
  "solarized-light",
] as const
type NamesTuple = typeof THEME_NAMES
export type StringTheme = NamesTuple[number]

export type Theme = StringTheme | RawTheme

export class UnknownThemeError extends Error {
  theme: string
  constructor(theme: string) {
    super(`Unknown theme: ${theme}`)
    this.theme = theme
  }
}
