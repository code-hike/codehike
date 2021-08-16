import { EditorTheme } from "@code-hike/smooth-code/dist/themes"

export enum ColorName {
  EditorBackground,
  ActiveTabBackground,
  ActiveTabForeground,
  InactiveTabBackground,
  InactiveTabForeground,
  EditorGroupBorder,
  EditorGroupHeaderBackground,
  TabBorder,
  ActiveTabBottomBorder,
}

type Color = string | undefined

const contrastBorder = "#6FC3DF"

export function getColor(
  theme: EditorTheme,
  colorName: ColorName
): Color {
  const colors = (theme as any).colors || {}
  switch (colorName) {
    case ColorName.EditorBackground:
      return (
        colors["editor.background"] ||
        getDefault(theme, {
          light: "#fffffe",
          dark: "#1E1E1E",
          hc: "#000000",
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
  const themeType = (theme.type
    ? theme.type
    : theme.name?.toLowerCase().includes("light")
    ? "light"
    : "dark") as "dark" | "light" | "hc"
  return defaults[themeType]
}

// defaults from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/common/theme.ts
