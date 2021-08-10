import {
  CodeAnnotation,
  InlineAnnotation,
  MultiLineAnnotation,
  TokenGroup,
  AnnotatedTokenGroups,
  FocusedLine,
  AnnotatedLine,
} from "./step-parser"
import {
  Tween,
  FullTween,
  mapWithDefault,
  map,
} from "@code-hike/utils"
import { EditorTheme } from "./themes"
import {
  hasColumns,
  parsePartToObject,
  ColumnExtremes,
} from "./focus-parser"
import React from "react"

export function parseAnnotations(
  annotations: Tween<CodeAnnotation[]> | undefined,
  theme: EditorTheme
): {
  inlineAnnotations: FullTween<
    Record<number, InlineAnnotation[] | undefined>
  >
  multilineAnnotations: FullTween<MultiLineAnnotation[]>
} {
  const inlineCodeAnnotations = mapWithDefault(
    annotations,
    [],
    annotations => annotations.filter(isInline)
  )
  const multilineCodeAnnotations = mapWithDefault(
    annotations,
    [],
    annotations => annotations.filter(a => !isInline(a))
  )
  return {
    inlineAnnotations: map(
      inlineCodeAnnotations,
      annotations =>
        parseInlineAnnotations(annotations, theme)
    ),
    multilineAnnotations: map(
      multilineCodeAnnotations,
      annotations =>
        parseMultilineAnnotations(annotations, theme)
    ),
  }
}

function isInline(annotation: CodeAnnotation): boolean {
  return hasColumns(annotation.focus)
}

function parseInlineAnnotations(
  annotations: CodeAnnotation[],
  theme: EditorTheme
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
      Component:
        annotation.Component ||
        defaultInlineComponent(annotation, theme),
    })
    annotationMap[lineNumber] = lineAnnotations
  })

  return annotationMap
}

function defaultInlineComponent(
  annotation: CodeAnnotation,
  theme: EditorTheme
): InlineAnnotation["Component"] {
  return ({ children }) => (
    <span style={{ outline: "red 1px solid" }}>
      {children}
    </span>
  )
}

function parseMultilineAnnotations(
  annotations: CodeAnnotation[],
  theme: EditorTheme
) {
  return []
}

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

  const annotatedGroups = [] as Tween<AnnotatedTokenGroups>[]

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
  while (currentStartColumn < newStartColumn) {
    const currentTokenGroup = tokenGroups.shift()!
    removedGroups.push(currentTokenGroup)
    const length = currentTokenGroup.tokens.reduce(
      (a, t) => a + t.content.length,
      0
    )
    currentStartColumn += length
  }
  return removedGroups
}
