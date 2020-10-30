type LineIndex = number
type ColumnIndex = number

export function getFocusExtremes(
  focus: string | null,
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

export function parseFocus(focus: string) {
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

export function getFocusSize(
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

export class LineOrColumnNumberError extends Error {
  constructor() {
    super(`Invalid line or column number in focus string`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class FocusNumberError extends Error {
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

function toEntries<K extends string | number | symbol, V>(
  o: Record<K, V>
): [K, V][] {
  const keys = Object.keys(o) as K[]
  return keys.map(k => [k, o[k]])
}
