type LineIndex = number
type ColumnIndex = number
type LineNumber = number
type ColumnNumber = number

export type FocusString = string | null | undefined

/**
 * Start 2 and end 4 means for the line "lorem"
 * means "ORE" is focused
 */
export type ColumnExtremes = {
  start: ColumnNumber
  end: ColumnNumber
}

type FocusMap = Record<LineNumber, true | ColumnExtremes[]>

export function mapFocusToLineNumbers(
  focus: FocusString,
  lines: any[]
): FocusMap {
  if (!focus) {
    // focus all lines
    return mergeToObject(
      [...lines.keys()].map(lineIndex => ({
        [lineIndex + 1]: true,
      }))
    )
  } else {
    return mergeToObject(
      splitParts(focus).map(parsePartToObject)
    )
  }
}

export function splitParts(focus: string) {
  return focus.split(/,(?![^\[]*\])/g)
}

function mergeToObject<K extends string | number, T>(
  entries: Record<K, T>[]
) {
  return entries.reduce(
    (acc, obj) => Object.assign(acc, obj),
    {}
  )
}

export function hasColumns(part: string) {
  return !!part.match(/(\d+)\[(.+)\]/)
}

export function parsePartToObject(part: string): FocusMap {
  // a part could be
  // - a line number: "2"
  // - a line range: "5:9"
  // - a line number with a column selector: "2[1,3:5,9]"
  const columnsMatch = part.match(/(\d+)\[(.+)\]/)
  if (columnsMatch) {
    const [, line, columns] = columnsMatch
    const columnsList = columns
      .split(",")
      .map(parseExtremes)
    const lineNumber = Number(line)
    return { [lineNumber]: columnsList }
  } else {
    return mergeToObject(
      expandString(part).map(lineNumber => ({
        [lineNumber]: true,
      }))
    )
  }
}

export function parseExtremes(part: string) {
  // Transforms something like
  // - "1:3" to {start:1, end: 3}
  // - "4" to {start:4, end:4}
  const [start, end] = part.split(":")

  if (!isNaturalNumber(start)) {
    throw new FocusNumberError(start)
  }

  const startNumber = Number(start)

  if (startNumber < 1) {
    throw new LineOrColumnNumberError()
  }

  if (!end) {
    return { start: startNumber, end: startNumber }
  } else {
    if (!isNaturalNumber(end)) {
      throw new FocusNumberError(end)
    }
    return { start: startNumber, end: +end }
  }
}

/**
 * Return the first and last indexes to focus, both included
 */
export function getFocusExtremes(
  focus: FocusString,
  lines: any[]
): [number, number] {
  if (!focus) {
    return [0, lines.length - 1]
  } else {
    const parsed = parseFocus(focus)
    const focusedIndexes = Object.keys(parsed).map(i =>
      parseInt(i, 10)
    )
    return [
      Math.min(...focusedIndexes),
      Math.max(...focusedIndexes),
    ]
  }
}

export function getFocusIndexes(
  focus: FocusString,
  lines: any[]
): number[] {
  if (!focus) {
    return [...lines.keys()]
  } else {
    const parsed = parseFocus(focus)
    const focusedIndexes = Object.keys(parsed).map(i =>
      parseInt(i, 10)
    )
    return focusedIndexes
  }
}

function getFocusByKey(focus: FocusString, keys: number[]) {
  if (!focus) {
    // focus all lines
    return fromEntries(keys.map(key => [key, true]))
  } else {
    const parsed = parseFocus(focus)
    const byKey: Record<number, true | number[]> = {}
    Object.keys(parsed).forEach(i => {
      const key = keys[parseInt(i, 10)]
      byKey[key] = parsed[parseInt(i, 10)]
    })
    return byKey
  }
}

function parseFocus(focus: string) {
  if (!focus) {
    throw new Error("Focus cannot be empty")
  }

  try {
    const parts = focus
      .split(/,(?![^\[]*\])/g)
      .map(parsePart)
    return fromEntries(parts.flat())
  } catch (error) {
    // TODO enhance error
    throw error
  }
}

type Part = [LineIndex, true | ColumnIndex[]]

function parsePart(part: string): Part[] {
  // a part could be
  // - a line number: "2"
  // - a line range: "5:9"
  // - a line number with a column selector: "2[1,3:5,9]"
  const columnsMatch = part.match(/(\d+)\[(.+)\]/)
  if (columnsMatch) {
    const [, line, columns] = columnsMatch
    const columnsList = columns.split(",").map(expandString)
    const lineIndex = Number(line) - 1
    const columnIndexes = columnsList.flat().map(c => c - 1)
    return [[lineIndex, columnIndexes]]
  } else {
    return expandString(part).map(lineNumber => [
      lineNumber - 1,
      true,
    ])
  }
}

function expandString(part: string) {
  // Transforms something like
  // - "1:3" to [1,2,3]
  // - "4" to [4]
  const [start, end] = part.split(":")

  if (!isNaturalNumber(start)) {
    throw new FocusNumberError(start)
  }

  const startNumber = Number(start)

  if (startNumber < 1) {
    throw new LineOrColumnNumberError()
  }

  if (!end) {
    return [startNumber]
  } else {
    if (!isNaturalNumber(end)) {
      throw new FocusNumberError(end)
    }

    const list: number[] = []
    for (let i = startNumber; i <= +end; i++) {
      list.push(i)
    }
    return list
  }
}

function isNaturalNumber(n: any) {
  n = n.toString() // force the value in case it is not
  var n1 = Math.abs(n),
    n2 = parseInt(n, 10)
  return !isNaN(n1) && n2 === n1 && n1.toString() === n
}

function getFocusSize(
  focus: Record<LineIndex, true | ColumnIndex[]>
) {
  const lineIndexList = Object.keys(focus).map(k => +k)
  const focusStart = Math.min.apply(Math, lineIndexList)
  const focusEnd = Math.max.apply(Math, lineIndexList)
  return {
    focusCenter: (focusStart + focusEnd + 1) / 2,
    focusCount: focusEnd - focusStart + 1,
  }
}

class LineOrColumnNumberError extends Error {
  constructor() {
    super(`Invalid line or column number in focus string`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

class FocusNumberError extends Error {
  number: string
  constructor(number: string) {
    super(`Invalid number "${number}" in focus string`)
    this.number = number
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

function fromEntries<K extends string | number | symbol, V>(
  pairs: [K, V][]
) {
  const result = {} as Record<K, V>

  let index = -1,
    length = pairs == null ? 0 : pairs.length

  while (++index < length) {
    var pair = pairs[index]
    result[pair[0]] = pair[1]
  }

  return result
}

// turns a relative string like (1,3) or [4:5] into a normal focus string
export function relativeToAbsolute(
  relativeString: string | undefined,
  lineNumber: number
): string {
  if (!relativeString) {
    return lineNumber.toString()
  }
  if (relativeString.startsWith("[")) {
    return `${lineNumber}` + relativeString
  }

  return splitParts(relativeString.slice(1, -1))
    .map(part => makePartAbsolute(part, lineNumber))
    .join(",")
}

function makePartAbsolute(
  part: string,
  lineNumber: number
) {
  const focusMap = parsePartToObject(part)
  const keys = Object.keys(focusMap).map(k => +k)

  if (keys.length > 1) {
    const min = Math.min(...keys)
    const max = Math.max(...keys)
    return `${min + lineNumber - 1}:${max + lineNumber - 1}`
  }
  const newMap = {} as FocusMap
  Object.keys(focusMap).forEach(ln => {
    newMap[+ln + lineNumber - 1] = focusMap[+ln]
  })
  return toFocusString(newMap)
}

function toFocusString(focusMap: FocusMap) {
  let parts = [] as string[]
  Object.keys(focusMap).forEach(ln => {
    const part = focusMap[+ln]
    if (part === true) {
      parts.push(ln)
    } else if (part instanceof Array) {
      const columnsString = part.map(extremes =>
        extremes.start === extremes.end
          ? extremes.start
          : `${extremes.start}:${extremes.end}`
      )
      parts.push(`${ln}[${columnsString}]`)
    }
  })
  return parts.join(",")
}
