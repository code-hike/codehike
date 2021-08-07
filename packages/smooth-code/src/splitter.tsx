import {
  Tween,
  mapWithDefault,
  FullTween,
  map,
} from "@code-hike/utils"
import {
  FocusString,
  parseExtremes,
  mapFocusToLineNumbers,
} from "./focus-parser"
import {
  MergedCode,
  FocusedCode,
  FocusedLine,
  MergedLine,
} from "./step-parser"

type Token = {
  content: string
}
type Line = {
  tokens: Token[]
  lineNumber: Tween<number>
}
type Annotation = {
  focus: string
}

type LineGroup = {
  lines: Line[]
  annotation?: any
}

export function splitByAnnotations<T extends Annotation>(
  { lines, ...rest }: { lines: Line[] },
  annotations?: FullTween<T[]>
) {
  const prevLines = lines.filter(
    ({ lineNumber }) => lineNumber.prev != undefined
  )
  const nextLines = lines.filter(
    ({ lineNumber }) => lineNumber.next != undefined
  )
  return {
    lines,
    groups: {
      prev: splitLinesByAnnotations(
        prevLines,
        annotations?.prev || []
      ),
      next: splitLinesByAnnotations(
        nextLines,
        annotations?.next || []
      ),
    },
    ...rest,
  }
}

function splitLinesByAnnotations(
  lines: Line[],
  annotations: Annotation[]
) {
  const annotationExtremes = annotations.map(
    ({ focus, ...annotation }) => ({
      ...parseExtremes(focus),
      annotation,
    })
  )
  annotationExtremes.sort((a, b) => a.start - b.start)

  const groups = [] as LineGroup[]
  let lineNumber = 1
  while (lineNumber <= lines.length) {
    const extremes = annotationExtremes.find(
      a => a.start === lineNumber
    )

    const group: LineGroup = {
      lines: [] as Line[],
      annotation: extremes?.annotation,
    }

    groups.push(group)

    const groupEndingCondition = (ln: number) =>
      extremes
        ? ln > extremes.end || ln >= lines.length + 1
        : annotationExtremes.some(a => a.start === ln) ||
          ln >= lines.length + 1

    while (!groupEndingCondition(lineNumber)) {
      group.lines.push(lines[lineNumber - 1])
      lineNumber++
    }
  }
  return groups
}

export function splitByFocus(
  mergedCode: MergedCode,
  focus: FullTween<FocusString>
): FocusedCode {
  const { lines, ...mergedCodeRest } = mergedCode
  const focusByLineNumber = map(focus, focus =>
    mapFocusToLineNumbers(focus, lines)
  )

  const splittedLines = lines.map(line => {
    const { tokens, ...rest } = line
    const prevLineFocus = line.lineNumber.prev
      ? focusByLineNumber.prev[line.lineNumber.prev]
      : false
    const nextLineFocus = line.lineNumber.next
      ? focusByLineNumber.next[line.lineNumber.next]
      : false

    let newTokens = splitByFocusObjects(tokens, {
      prev: prevLineFocus,
      next: nextLineFocus,
    })
    return {
      tokens: newTokens,
      focused: {
        prev: Array.isArray(prevLineFocus)
          ? ("by-column" as const)
          : prevLineFocus,
        next: Array.isArray(nextLineFocus)
          ? ("by-column" as const)
          : nextLineFocus,
      },
      ...rest,
    } as FocusedLine
  })

  const focusedLineNumbers = map(
    focusByLineNumber,
    focusByLineNumber =>
      Object.keys(focusByLineNumber).map(k => Number(k))
  )

  const firstFocusedLineNumber = map(
    focusedLineNumbers,
    focusedLineNumbers => Math.min(...focusedLineNumbers)
  )

  const lastFocusedLineNumber = map(
    focusedLineNumbers,
    focusedLineNumbers => Math.max(...focusedLineNumbers)
  )

  return {
    lines: splittedLines,
    firstFocusedLineNumber,
    lastFocusedLineNumber,
    ...mergedCodeRest,
  }
}

/**
 * Splits the tokens that have different prev focus or next focus.
 */
function splitByFocusObjects(
  tokens: MergedLine["tokens"],
  focus: Tween<{ start: number; end: number }[] | boolean>
) {
  let breakindexes = [] as number[]
  mapWithDefault(focus, [], columns => {
    if (Array.isArray(columns)) {
      columns.forEach(({ start, end }) => {
        breakindexes.push(start - 1)
        breakindexes.push(end)
      })
    }
  })

  let i = 0
  let newTokens = [] as FocusedLine["tokens"]

  tokens.forEach(token => {
    const { content, ...rest } = token
    let newContent = ""
    for (let j = 0; j < content.length; j++) {
      if (i + j > 0 && breakindexes.includes(i + j)) {
        newTokens.push({
          content: newContent,
          ...rest,
          focused: {
            prev:
              !focus.prev || isIn(i + j - 1, focus.prev),
            next:
              !focus.next || isIn(i + j - 1, focus.next),
          },
        })
        newContent = ""
      }
      newContent += content[j]
    }
    i += content.length
    newTokens.push({
      content: newContent,
      ...rest,
      focused: {
        prev: !focus.prev || isIn(i - 1, focus.prev),
        next: !focus.next || isIn(i - 1, focus.next),
      },
    })
  })

  return newTokens
}

function isIn(
  index: number,
  intervals: { start: number; end: number }[] | boolean
) {
  if (!Array.isArray(intervals)) {
    return intervals
  }
  return intervals.some(
    ({ start, end }) => start - 1 <= index && index < end
  )
}
