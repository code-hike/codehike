import { RawCode } from "codehike/code"
import { themeIcons } from "seti-icons"

export function CodeIcon({ title }: { title: string }) {
  let filename = title || ""
  if (filename.endsWith(".mdx")) {
    filename = filename.slice(0, -4)
    filename += ".md"
  } else if (filename.endsWith(".mjs")) {
    filename = filename.slice(0, -4)
    filename += ".js"
  }

  const { svg, color } = getLightIcon(filename)
  const __html = svg.replace(
    /svg/,
    `svg fill='${color}' height='28' style='margin: -8px'`,
  )
  return (
    <span
      dangerouslySetInnerHTML={{ __html }}
      style={{ display: "contents", margin: -10 }}
    />
  )
}

const getDarkIcon = themeIcons({
  blue: "#519aba",
  grey: "#4d5a5e",
  "grey-light": "#6d8086",
  green: "#8dc149",
  orange: "#e37933",
  pink: "#f55385",
  purple: "#a074c4",
  red: "#cc3e44",
  white: "#d4d7d6",
  yellow: "#cbcb41",
  ignore: "#41535b",
})

const getLightIcon = themeIcons({
  blue: "#498ba7",
  grey: "#455155",
  "grey-light": "#627379",
  green: "#7fae42",
  orange: "#f05138",
  pink: "#dd4b78",
  purple: "#9068b0",
  red: "#b8383d",
  white: "#bfc2c1",
  yellow: "#b7b73b",
  ignore: "#3b4b52",
})
