import {
  CodeAnnotation,
  InlineAnnotation,
  MultiLineAnnotation,
  TokenGroup,
  AnnotatedTokenGroups,
  FocusedLine,
  AnnotatedLine,
  LineGroup,
} from "./partial-step-parser"
import {
  Tween,
  FullTween,
  mapWithDefault,
  map,
  hasColumns,
  parsePartToObject,
  splitParts,
  ColumnExtremes,
  parseExtremes,
} from "../utils"

export function parseAnnotations(
  annotations:
    | Tween<CodeAnnotation[] | undefined>
    | undefined
): {
  inlineAnnotations: FullTween<
    Record<number, InlineAnnotation[] | undefined>
  >
  multilineAnnotations: FullTween<MultiLineAnnotation[]>
} {
  // split annotations with multiple parts in the focus string
  // "1:2,3[4:5]" becomes  two annotations "1:2" and "3[4:5]"
  const expandedAnnotations = mapWithDefault(
    annotations,
    [],
    annotations =>
      annotations!.flatMap(annotation =>
        splitParts(annotation.focus).map(part => ({
          ...annotation,
          focus: part,
        }))
      )
  )

  const inlineCodeAnnotations = mapWithDefault(
    expandedAnnotations,
    [],
    annotations => annotations!.filter(isInline)
  )
  const multilineCodeAnnotations = mapWithDefault(
    expandedAnnotations,
    [],
    annotations => annotations!.filter(a => !isInline(a))
  )
  return {
    inlineAnnotations: map(
      inlineCodeAnnotations,
      annotations => parseInlineAnnotations(annotations)
    ),
    multilineAnnotations: map(
      multilineCodeAnnotations,
      annotations => parseMultilineAnnotations(annotations)
    ),
  }
}

function isInline(annotation: CodeAnnotation): boolean {
  return hasColumns(annotation.focus)
}

function parseInlineAnnotations(
  annotations: CodeAnnotation[]
): Record<number, InlineAnnotation[]> {
  const annotationMap = {} as Record<
    number,
    InlineAnnotation[]
  >

  annotations.forEach(annotation => {
    const focusMap = parsePartToObject(annotation.focus)
    const lineNumber = +Object.keys(focusMap)[0]
    const columnNumbersList = focusMap[
      lineNumber
    ] as ColumnExtremes[]
    const lineAnnotations = annotationMap[lineNumber] || []
    lineAnnotations.push({
      columnNumbers: columnNumbersList[0],
      data: annotation.data,
      Component: annotation.Component,
    })
    annotationMap[lineNumber] = lineAnnotations
  })

  return annotationMap
}

function parseMultilineAnnotations(
  annotations: CodeAnnotation[]
): MultiLineAnnotation[] {
  return annotations.map(annotation => {
    return {
      lineNumbers: parseExtremes(annotation.focus),
      data: annotation.data,
      Component: annotation.Component,
    }
  })
}

// --- multiline

export function annotateMultiline(
  lines: AnnotatedLine[],
  annotations: FullTween<MultiLineAnnotation[]>
): FullTween<LineGroup[]> {
  return {
    prev: annotateMultilineSide(
      lines,
      annotations.prev,
      line => line.lineNumber.prev
    ),
    next: annotateMultilineSide(
      lines,
      annotations.next,
      line => line.lineNumber.next
    ),
  }
}

function annotateMultilineSide(
  lines: AnnotatedLine[],
  ogAnnotations: MultiLineAnnotation[],
  getLineNumber: (line: AnnotatedLine) => number | undefined
): LineGroup[] {
  const annotations = [...ogAnnotations]
  annotations.sort(
    (a, b) => a.lineNumbers.start - b.lineNumbers.start
  )

  let lineIndex = 0
  const groups = [] as LineGroup[]

  while (lineIndex < lines.length) {
    const annotation = annotations[0]
    let line = lines[lineIndex]
    if (
      annotation &&
      getLineNumber(line) > annotation.lineNumbers.start
    ) {
      throw "Code Hike can't handle two annotations for the same line"
    }
    if (
      annotation &&
      getLineNumber(line) === annotation.lineNumbers.start
    ) {
      // create annotation group
      const group = {
        lines: [],
        annotation,
      } as LineGroup

      while (
        line &&
        (!getLineNumber(line) ||
          getLineNumber(line)! <=
            annotation.lineNumbers.end)
      ) {
        group.lines.push(line)
        line = lines[++lineIndex]
      }

      groups.push(group)
      annotations.shift()
    } else if (!annotation) {
      // create unannotated group until the end
      groups.push({ lines: lines.slice(lineIndex) })
      lineIndex = lines.length
    } else {
      // create unannotated group until next annotation
      const group = {
        lines: [],
      } as LineGroup

      while (
        line &&
        (!getLineNumber(line) ||
          getLineNumber(line)! <
            annotation.lineNumbers.start)
      ) {
        group.lines.push(line)
        line = lines[++lineIndex]
      }

      groups.push(group)
    }
  }

  return groups
}

// --- inline

export function annotateInline(
  lines: FocusedLine[],
  inlineAnnotations: FullTween<
    Record<number, InlineAnnotation[] | undefined>
  >
) {
  return lines.map(({ groups, ...line }) => {
    const { lineNumber } = line
    const annotations = {
      prev: lineNumber.prev
        ? inlineAnnotations.prev[lineNumber.prev] || []
        : [],
      next: lineNumber.next
        ? inlineAnnotations.next[lineNumber.next] || []
        : [],
    }
    return {
      ...line,
      annotatedGroups: annotateLineTokenGroups(
        groups,
        annotations
      ),
    }
  })
}

/**
 * Generate a list of annotated groups tweens
 * each annotated group contains a list of token groups and maybe an annotation.
 * The two annotated groups in a tween doesn't need to have the same token groups.
 */
export function annotateLineTokenGroups(
  tokenGroups: TokenGroup[],
  annotations: FullTween<InlineAnnotation[]>
): Tween<AnnotatedTokenGroups>[] {
  let prevTokenGroups = [...tokenGroups]
  let nextTokenGroups = [...tokenGroups]
  const prevAnnotations = [...annotations.prev]
  const nextAnnotations = [...annotations.next]

  const annotatedGroups =
    [] as Tween<AnnotatedTokenGroups>[]

  let prevColumn = 1
  let nextColumn = 1

  // iterate until we consume both lists of token groups
  while (
    prevTokenGroups.length > 0 ||
    nextTokenGroups.length > 0
  ) {
    const prevAnnotation = prevAnnotations[0]
    const nextAnnotation = nextAnnotations[0]

    const isPrevAnnotationStarting =
      prevAnnotation &&
      prevAnnotation.columnNumbers.start === prevColumn
    const isNextAnnotationStarting =
      nextAnnotation &&
      nextAnnotation.columnNumbers.start === nextColumn

    if (prevColumn < nextColumn) {
      // if the prev list is behind we consume from prevTokenGroups
      if (isPrevAnnotationStarting) {
        // if there is an annotation starting at this point we consume until the annotation ends
        const end = prevAnnotation.columnNumbers.end + 1
        annotatedGroups.push({
          prev: {
            annotation: prevAnnotation,
            groups: shiftGroups(
              prevTokenGroups,
              prevColumn,
              end
            ),
          },
        })
        prevColumn = end
        prevAnnotations.shift()
      } else {
        // if there isn't we consume until we sync with the next list or an annotation starts
        const end = Math.min(
          nextColumn,
          prevAnnotation?.columnNumbers.start || nextColumn
        )
        annotatedGroups.push({
          prev: {
            groups: shiftGroups(
              prevTokenGroups,
              prevColumn,
              end
            ),
          },
        })
        prevColumn = end
      }
    } else if (prevColumn > nextColumn) {
      // if the next list is behind we consume from nextTokenGroups
      if (isNextAnnotationStarting) {
        // if there is an annotation starting at this point we consume until the annotation ends
        const end = nextAnnotation.columnNumbers.end + 1
        annotatedGroups.push({
          next: {
            annotation: nextAnnotation,
            groups: shiftGroups(
              nextTokenGroups,
              nextColumn,
              end
            ),
          },
        })
        nextColumn = end
        nextAnnotations.shift()
      } else {
        // if there isn't we consume until we sync with the prev list or an annotation starts
        const end = Math.min(
          prevColumn,
          nextAnnotation?.columnNumbers.start || prevColumn
        )
        annotatedGroups.push({
          next: {
            groups: shiftGroups(
              nextTokenGroups,
              nextColumn,
              end
            ),
          },
        })
        nextColumn = end
      }
    } else if (prevColumn == nextColumn) {
      // if we are at the same column in both lists we have 5 different cases
      if (
        isPrevAnnotationStarting &&
        isNextAnnotationStarting &&
        prevAnnotation.columnNumbers.end ===
          nextAnnotation.columnNumbers.end
      ) {
        // both annotations starts here and end at the same place, so we puth both in one tween annotated group
        const end = nextAnnotation.columnNumbers.end + 1

        annotatedGroups.push({
          prev: {
            annotation: prevAnnotation,
            groups: shiftGroups(
              prevTokenGroups,
              prevColumn,
              end
            ),
          },
          next: {
            annotation: nextAnnotation,
            groups: shiftGroups(
              nextTokenGroups,
              nextColumn,
              end
            ),
          },
        })

        prevColumn = end
        nextColumn = end
        prevAnnotations.shift()
        nextAnnotations.shift()
      } else if (isPrevAnnotationStarting) {
        // if only the prev annotation starting at this point we consume until the annotation ends
        const end = prevAnnotation.columnNumbers.end + 1
        annotatedGroups.push({
          prev: {
            annotation: prevAnnotation,
            groups: shiftGroups(
              prevTokenGroups,
              prevColumn,
              end
            ),
          },
        })
        prevColumn = end
        prevAnnotations.shift()
      } else if (isNextAnnotationStarting) {
        // same for the next annotation
        const end = nextAnnotation.columnNumbers.end + 1
        annotatedGroups.push({
          next: {
            annotation: nextAnnotation,
            groups: shiftGroups(
              nextTokenGroups,
              nextColumn,
              end
            ),
          },
        })
        nextColumn = end
        nextAnnotations.shift()
      } else if (!prevAnnotation && !nextAnnotation) {
        // if there aren't any remaining annotation we add a last group
        annotatedGroups.push({
          prev: { groups: prevTokenGroups },
          next: { groups: nextTokenGroups },
        })
        // this is the last iteration
        prevTokenGroups = []
        nextTokenGroups = []
      } else {
        // if we still have annotations left we consume until the next one
        const end = Math.min(
          prevAnnotation?.columnNumbers.start ||
            Number.MAX_VALUE,
          nextAnnotation?.columnNumbers.start ||
            Number.MAX_VALUE
        )
        annotatedGroups.push({
          prev: {
            groups: shiftGroups(
              prevTokenGroups,
              prevColumn,
              end
            ),
          },
          next: {
            groups: shiftGroups(
              nextTokenGroups,
              nextColumn,
              end
            ),
          },
        })

        prevColumn = end
        nextColumn = end
      }
    }
  }

  return annotatedGroups
}

/**
 * Remove and return some groups from the beggining of the array
 * startColumn is the column at which the array is starting
 * (because other groups has been already removed)
 * newStartColumn is the first column that should stay in the array
 */
function shiftGroups(
  tokenGroups: TokenGroup[],
  startColumn: number,
  newStartColumn: number
): TokenGroup[] {
  const removedGroups = [] as TokenGroup[]
  let currentStartColumn = startColumn
  while (
    currentStartColumn < newStartColumn &&
    tokenGroups.length > 0
  ) {
    const currentTokenGroup = tokenGroups.shift()
    removedGroups.push(currentTokenGroup)
    const length = currentTokenGroup.tokens.reduce(
      (a, t) => a + t.content.length,
      0
    )
    currentStartColumn += length
  }
  return removedGroups
}
