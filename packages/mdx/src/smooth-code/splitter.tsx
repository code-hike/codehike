import {
  Tween,
  FullTween,
  map,
  FocusString,
  mapFocusToLineNumbers,
  ColumnExtremes,
} from "../utils"
import {
  MergedCode,
  FocusedCode,
  FocusedLine,
  MergedLine,
  TokenGroup,
  LineGroup,
  AnnotatedLine,
  MultiLineAnnotation,
  InlineAnnotation,
} from "./partial-step-parser"
import React from "react"

export function splitByAnnotations(
  lines: AnnotatedLine[],
  annotations?: FullTween<MultiLineAnnotation[]>
) {
  const prevLines = lines.filter(
    ({ lineNumber }) => lineNumber.prev != undefined
  )
  const nextLines = lines.filter(
    ({ lineNumber }) => lineNumber.next != undefined
  )
  return {
    prev: splitLinesByAnnotations(
      prevLines,
      annotations?.prev || []
    ),
    next: splitLinesByAnnotations(
      nextLines,
      annotations?.next || []
    ),
  }
}

function splitLinesByAnnotations(
  lines: AnnotatedLine[],
  annotations: MultiLineAnnotation[]
) {
  const annotationExtremes = annotations.map(
    ({ lineNumbers, ...annotation }) => ({
      ...lineNumbers,
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
  focus: FullTween<FocusString>,
  annotations: FullTween<
    Record<number, InlineAnnotation[] | undefined>
  >
): FocusedCode {
  const { lines, ...mergedCodeRest } = mergedCode

  const focusByLineNumber = map(focus, (focus, key) => {
    // we need to filter the lines that don't belong to the step
    // for the case where focus == ""
    const stepLines =
      key === "prev"
        ? lines.filter(l => l.move !== "enter")
        : lines.filter(l => l.move !== "exit")

    return mapFocusToLineNumbers(focus, stepLines)
  })

  const splittedLines = lines.map(line => {
    const { tokens, ...rest } = line

    const lineFocus = {
      prev: line.lineNumber.prev
        ? focusByLineNumber.prev[line.lineNumber.prev]
        : false,
      next: line.lineNumber.next
        ? focusByLineNumber.next[line.lineNumber.next]
        : false,
    }

    const lineAnnotations = {
      prev: line.lineNumber.prev
        ? annotations.prev[line.lineNumber.prev] || []
        : [],
      next: line.lineNumber.next
        ? annotations.next[line.lineNumber.next] || []
        : [],
    }

    return {
      focused: map(lineFocus, focus => !!focus),
      groups: getTokenGroups(
        tokens,
        lineFocus,
        lineAnnotations
      ),
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

interface TokenGroupWithoutElement
  extends Omit<TokenGroup, "element"> {
  annotation: Tween<InlineAnnotation | undefined>
}
/**
 * Get the least amount of groups where no consecutive groups have
 * the same combination of prevFocus, nextFocus, prevAnnotation, nextAnnotation.
 */
function getTokenGroups(
  tokens: MergedLine["tokens"],
  focus: FullTween<boolean | ColumnExtremes[]>,
  annotations: FullTween<InlineAnnotation[]>
) {
  const focusExtremes = map(focus, focus =>
    Array.isArray(focus) ? focus : []
  )

  const annotationExtremes = map(annotations, annotations =>
    annotations.map(
      ({ columnNumbers }) => columnNumbers as ColumnExtremes
    )
  )

  const allExtremes = [
    ...focusExtremes.prev,
    ...focusExtremes.next,
    ...annotationExtremes.prev,
    ...annotationExtremes.next,
  ]

  const splittedTokens = splitTokens(tokens, allExtremes)

  let startIndex = 0
  let currentGroup = null as TokenGroupWithoutElement | null
  const groups = [] as TokenGroupWithoutElement[]
  splittedTokens.forEach(token => {
    const newPrevFocus = isIn(startIndex, focus.prev)
    const newNextFocus = isIn(startIndex, focus.next)
    const newPrevAnnotation = getAnnotation(
      startIndex,
      annotations.prev
    )
    const newNextAnnotation = getAnnotation(
      startIndex,
      annotations.next
    )

    if (
      !currentGroup ||
      currentGroup.focused.prev !== newPrevFocus ||
      currentGroup.focused.next !== newNextFocus ||
      currentGroup.annotation.prev !== newPrevAnnotation ||
      currentGroup.annotation.next !== newNextAnnotation
    ) {
      currentGroup = {
        focused: {
          prev: newPrevFocus,
          next: newNextFocus,
        },
        tokens: [],
        annotation: {
          prev: newPrevAnnotation,
          next: newNextAnnotation,
        },
      }
      groups.push(currentGroup)
    }

    currentGroup?.tokens.push(token)

    startIndex += token.content.length
  })

  return groups.map(
    group =>
      ({
        focused: group.focused,
        tokens: group.tokens,
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

function getAnnotation(
  index: number,
  annotations: InlineAnnotation[]
) {
  return annotations.find(
    ({ columnNumbers }) =>
      columnNumbers.start - 1 <= index &&
      index < columnNumbers.end
  )
}
