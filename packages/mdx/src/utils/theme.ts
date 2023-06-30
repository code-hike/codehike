import {
  Theme,
  RawTheme,
  getThemeColors,
  getThemeColorsSync,
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

export function getCSSVariablesObjectSync(theme: RawTheme) {
  const themeColors = getThemeColorsSync(theme)
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
  return rules
}
