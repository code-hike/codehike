type Color = string | undefined
type ColorObject =
  | {
      r: number
      g: number
      b: number
      a: number
    }
  | undefined

// from https://stackoverflow.com/a/53936623/1325646
const isValidHex = (hex: string) =>
  /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)
const getChunksFromString = (
  st: string,
  chunkSize: number
) => st.match(new RegExp(`.{${chunkSize}}`, "g"))
const convertHexUnitTo256 = (hex: string) =>
  parseInt(hex.repeat(2 / hex.length), 16)
function getAlphaFloat(a, alpha) {
  if (typeof a !== "undefined") {
    return a / 255
  }
  if (typeof alpha != "number" || alpha < 0 || alpha > 1) {
    return 1
  }
  return alpha
}

export function hexToObject(hex: Color) {
  if (!hex) {
    return undefined
  }
  if (!isValidHex(hex)) {
    throw new Error(
      "Invalid color string, must be a valid hex color"
    )
  }
  const chunkSize = Math.floor((hex.length - 1) / 3)
  const hexArr = getChunksFromString(
    hex.slice(1),
    chunkSize
  )
  const [r, g, b, a] = hexArr.map(convertHexUnitTo256)
  return {
    r,
    g,
    b,
    a: getAlphaFloat(a, 1),
  }
}

export function objectToHex(object: ColorObject) {
  if (!object) {
    return undefined
  }
  const { r, g, b, a } = object
  const alpha = Math.round(a * 255)
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b
    .toString(16)
    .padStart(2, "0")}${alpha
    .toString(16)
    .padStart(2, "0")}`
}

export function transparent(
  color: Color,
  opacity: number
): Color {
  if (!color) {
    return color
  }
  const { r, g, b, a } = hexToObject(color)
  return objectToHex({ r, g, b, a: a * opacity })
}
