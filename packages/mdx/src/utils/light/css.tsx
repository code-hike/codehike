import { Theme } from "@code-hike/lighter"
import {
  getColor,
  getColorScheme,
  getTheme,
} from "./theme-colors"

const keys = [
  "editor.background",
  "editor.foreground",
  "editor.lineHighlightBackground",
  "editor.rangeHighlightBackground",
  "editor.infoForeground",
  "editor.selectionBackground",
  "focusBorder",
  "tab.activeBackground",
  "tab.activeForeground",
  "tab.inactiveBackground",
  "tab.inactiveForeground",
  "tab.border",
  "tab.activeBorder",
  "editorGroup.border",
  "editorGroupHeader.tabsBackground",
  "editorLineNumber.foreground",
  "input.background",
  "input.foreground",
  "input.border",
  "icon.foreground",
  "sideBar.background",
  "sideBar.foreground",
  "sideBar.border",
  "list.activeSelectionBackground",
  "list.activeSelectionForeground",
  "list.hoverBackground",
  "list.hoverForeground",
]

function v(key: string) {
  return `var(${vn(key)})`
}

function vn(key: string) {
  return `--ch-l-${key.replace(".", "-")}`
}

export const CSSV = {
  colorScheme: v("colorScheme"),
  foreground: v("foreground"),
  background: v("background"),
  lighter: {
    inlineBackground: v("lighter.inlineBackground"),
  },
  editor: {
    background: v("editor.background"),
    foreground: v("editor.foreground"),
    lineHighlightBackground: v(
      "editor.lineHighlightBackground"
    ),
    rangeHighlightBackground: v(
      "editor.rangeHighlightBackground"
    ),
    infoForeground: v("editor.infoForeground"),
    selectionBackground: v("editor.selectionBackground"),
  },
  focusBorder: v("focusBorder"),
  tab: {
    activeBackground: v("tab.activeBackground"),
    activeForeground: v("tab.activeForeground"),
    inactiveBackground: v("tab.inactiveBackground"),
    inactiveForeground: v("tab.inactiveForeground"),
    border: v("tab.border"),
    activeBorder: v("tab.activeBorder"),
  },
  editorGroup: {
    border: v("editorGroup.border"),
  },
  editorGroupHeader: {
    tabsBackground: v("editorGroupHeader.tabsBackground"),
  },
  editorLineNumber: {
    foreground: v("editorLineNumber.foreground"),
  },
  input: {
    background: v("input.background"),
    foreground: v("input.foreground"),
    border: v("input.border"),
  },
  icon: {
    foreground: v("icon.foreground"),
  },
  sideBar: {
    background: v("sideBar.background"),
    foreground: v("sideBar.foreground"),
    border: v("sideBar.border"),
  },
  list: {
    activeSelectionBackground: v(
      "list.activeSelectionBackground"
    ),
    activeSelectionForeground: v(
      "list.activeSelectionForeground"
    ),
    hoverBackground: v("list.hoverBackground"),
    hoverForeground: v("list.hoverForeground"),
  },
}

export function getCSSVariables(theme: Theme) {
  const finalTheme = getTheme(theme)
  const vars = {}
  for (const key of keys) {
    vars[vn(key)] = getColor(finalTheme, key)
  }
  vars[vn("colorScheme")] = getColorScheme(finalTheme)
  vars[vn("foreground")] = vars[vn("editor.foreground")]
  vars[vn("background")] = vars[vn("editor.background")]
  vars[vn("lighter.inlineBackground")] =
    vars[vn("editor.background")] // should be background with 90% opacity
  return vars
}
