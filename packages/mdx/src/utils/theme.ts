import {
  Theme,
  RawTheme,
  getThemeColors,
} from "@code-hike/lighter/dist/browser.esm.mjs"

const styleCache = new Map<string, string>()

export async function getStyle(theme: Theme) {
  const themeName =
    typeof theme === "string" ? theme : theme.name
  if (styleCache.has(themeName)) {
    return { themeName, style: styleCache.get(themeName) }
  }
  const rules = await getCSSVariables(theme)
  const style = `[data-ch-theme="${themeName}"] \{  ${rules} \}`
  styleCache.set(themeName, style)
  return { themeName, style }
}

async function getCSSVariables(theme: Theme) {
  const themeColors = await getThemeColors(theme)

  if (!themeColors || typeof themeColors !== "object") {
    throw new Error(
      "[Code Hike error] Unknown theme format"
    )
  }
  let rules = ""
  for (const [first, value] of Object.entries(
    themeColors
  )) {
    if (!value) {
      continue
    }
    if (typeof value === "string") {
      rules += `--ch-t-${first}: ${value};`
    } else {
      for (const [second, svalue] of Object.entries(
        value
      )) {
        if (!svalue) {
          continue
        }
        rules += `--ch-t-${first}-${second}: ${svalue};`
      }
    }
  }
  return rules
}

export async function getCSSVariablesObject(theme: Theme) {
  const themeColors = await getThemeColors(theme)
  const rules: Record<string, string> = {}
  if (!themeColors || typeof themeColors !== "object") {
    throw new Error(
      "[Code Hike error] Unknown theme format"
    )
  }
  for (const [first, value] of Object.entries(
    themeColors
  )) {
    if (!value) {
      continue
    }
    if (typeof value === "string") {
      rules[`--ch-t-${first}`] = value
    } else {
      for (const [second, svalue] of Object.entries(
        value
      )) {
        if (!svalue) {
          continue
        }
        rules[`--ch-t-${first}-${second}`] = svalue
      }
    }
  }
  console.log(rules)
  return rules
}

export function getCSSVariablesObjectSync(theme: RawTheme) {
  // TODO create sync function in lighter
  return {
    "--ch-t-colorScheme": "dark",
    "--ch-t-foreground": "#c9d1d9",
    "--ch-t-background": "#0d1117",
    "--ch-t-lighter-inlineBackground": "#0d1117e6",
    "--ch-t-editor-background": "#0d1117",
    "--ch-t-editor-foreground": "#c9d1d9",
    "--ch-t-editor-lineHighlightBackground": "#6e76811a",
    "--ch-t-editor-rangeHighlightBackground": "#ffffff0b",
    "--ch-t-editor-infoForeground": "#3794FF",
    "--ch-t-editor-selectionBackground": "#264F78",
    "--ch-t-focusBorder": "#1f6feb",
    "--ch-t-tab-activeBackground": "#0d1117",
    "--ch-t-tab-activeForeground": "#c9d1d9",
    "--ch-t-tab-inactiveBackground": "#010409",
    "--ch-t-tab-inactiveForeground": "#8b949e",
    "--ch-t-tab-border": "#30363d",
    "--ch-t-tab-activeBorder": "#0d1117",
    "--ch-t-editorGroup-border": "#30363d",
    "--ch-t-editorGroupHeader-tabsBackground": "#010409",
    "--ch-t-editorLineNumber-foreground": "#6e7681",
    "--ch-t-input-background": "#0d1117",
    "--ch-t-input-foreground": "#c9d1d9",
    "--ch-t-input-border": "#30363d",
    "--ch-t-icon-foreground": "#8b949e",
    "--ch-t-sideBar-background": "#010409",
    "--ch-t-sideBar-foreground": "#c9d1d9",
    "--ch-t-sideBar-border": "#30363d",
    "--ch-t-list-activeSelectionBackground": "#6e768166",
    "--ch-t-list-activeSelectionForeground": "#c9d1d9",
    "--ch-t-list-hoverBackground": "#6e76811a",
    "--ch-t-list-hoverForeground": "#c9d1d9",
  }
}
