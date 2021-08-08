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
  ColumnExtremes,
} from "./focus-parser"
import {
  MergedCode,
  FocusedCode,
  FocusedLine,
  MergedLine,
  TokenGroup,
  LineGroup,
  CodeAnnotation,
} from "./step-parser"
import React from "react"

export function splitByAnnotations(
  { lines, ...rest }: FocusedCode,
  annotations?: FullTween<CodeAnnotation[]>
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
  lines: FocusedCode["lines"],
  annotations: CodeAnnotation[]
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

    const group = {
      lines: [],
      annotation: extremes?.annotation,
    } as LineGroup

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

    return {
      focused: {
        prev: Array.isArray(prevLineFocus)
          ? ("by-column" as const)
          : prevLineFocus,
        next: Array.isArray(nextLineFocus)
          ? ("by-column" as const)
          : nextLineFocus,
      },
      groups: getTokenGroups(tokens, {
        prev: prevLineFocus,
        next: nextLineFocus,
      }),
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

type TokenGroupWithoutElement = Omit<TokenGroup, "element">
/**
 * Get the least amount of groups where no consecutive groups have
 * the same combination of prevFocus and nextFocus.
 */
function getTokenGroups(
  tokens: MergedLine["tokens"],
  focus: FullTween<boolean | ColumnExtremes[]>
) {
  const extremes = map(focus, focus =>
    Array.isArray(focus) ? focus : []
  )
  const allExtremes = [...extremes.prev, ...extremes.next]
  const splittedTokens = splitTokens(tokens, allExtremes)

  console.log({ splittedTokens })

  let startIndex = 0
  let currentGroup = null as TokenGroupWithoutElement | null
  const groups = [] as TokenGroupWithoutElement[]
  splittedTokens.forEach(token => {
    const newPrevFocus = isIn(startIndex, focus.prev)
    const newNextFocus = isIn(startIndex, focus.next)

    if (
      !currentGroup ||
      currentGroup.focused.prev !== newPrevFocus ||
      currentGroup.focused.next !== newNextFocus
    ) {
      currentGroup = {
        focused: {
          prev: newPrevFocus,
          next: newNextFocus,
        },
        tokens: [],
      }
      groups.push(currentGroup)
    }

    currentGroup?.tokens.push(token)

    startIndex += token.content.length
  })

  return groups.map(
    group =>
      ({
        ...group,
        element: getGroupElement(group),
      } as TokenGroup)
  )
}

function getGroupElement(group: TokenGroupWithoutElement) {
  return (
    <>
      {group.tokens.map(({ content, props }, i) => (
        <span {...props} key={i + 1}>
          {content}
        </span>
      ))}
    </>
  )
}

/**
 * Split a list of tokens into a more fine-graned list of tokens
 *
 * tokens: [abc][defg]
 * extremes: [1:2,2:5]
 * result tokens: [ab][c][de][fg]
 *
 */
export function splitTokens(
  tokens: MergedLine["tokens"],
  extremes: ColumnExtremes[]
) {
  const splitIndexes = [
    ...extremes.map(e => e.start - 1),
    ...extremes.map(e => e.end),
  ]

  let oldTokens = tokens
  splitIndexes.forEach(splitIndex => {
    const newTokens = [] as MergedLine["tokens"]
    let i = 0
    oldTokens.forEach(token => {
      const startIndex = i
      const endIndex = i + token.content.length
      const shouldSplit =
        startIndex < splitIndex && splitIndex < endIndex
      if (shouldSplit) {
        const sliceIndex = splitIndex - startIndex
        const content0 = token.content.slice(0, sliceIndex)
        const content1 = token.content.slice(sliceIndex)
        newTokens.push({ ...token, content: content0 })
        newTokens.push({ ...token, content: content1 })
      } else {
        newTokens.push(token)
      }
      i = endIndex
    })
    oldTokens = newTokens
  })

  return oldTokens
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
