import {
  Tween,
  mapWithDefault,
  map,
  FullTween,
  withDefault,
} from "@code-hike/utils"
import { FocusString } from "./focus-parser"
import {
  isHighlighterReady,
  loadHighlighter,
  highlightOrPlaceholder,
} from "./highlighter"
import { EditorTheme } from "./themes"
import { mergeLines } from "./differ"
import {
  splitByFocus,
  splitByAnnotations,
} from "./splitter"
import { useAsyncMemo } from "./use-async-memo"
import React from "react"
import { TweenParams } from "./tween"
import { getLinesWithElements } from "./line-elements"
import {
  parseAnnotations,
  annotateInline,
} from "./annotations"

export type CodeAnnotation = {
  focus: string
  Component?: (props: {
    style?: React.CSSProperties
    children: React.ReactNode
  }) => React.ReactElement
}
type ParseInput = {
  code: Tween<string>
  theme: EditorTheme
  lang: string
  focus: Tween<FocusString>
  annotations?: Tween<CodeAnnotation[]>
}

export function useStepParser(input: ParseInput) {
  const { lang, theme, code } = input
  return useAsyncMemo(
    {
      isReady: isHighlighterReady(lang, theme),
      load: () => loadHighlighter(lang, theme),
      run: () => parse(input),
      placeholder: () => parse(input),
    },
    [code.prev, code.next, lang, theme]
  )
}

function parse({
  code,
  theme,
  lang,
  focus,
  annotations,
}: ParseInput) {
  const normalCode = mapWithDefault(code, "", normalize)

  const highlightedLines = map(normalCode, code =>
    highlight({ code, theme, lang })
  )

  const mergedCode = merge(normalCode, highlightedLines)

  const {
    inlineAnnotations,
    multilineAnnotations,
  } = parseAllAnnotations(annotations, theme)

  const focusedCode = splitLinesByFocus(
    mergedCode,
    withDefault(focus, null),
    inlineAnnotations
  )

  const annotatedCode = addAnnotations(
    focusedCode,
    inlineAnnotations,
    multilineAnnotations
  )

  const codeStep = addExtraStuff(annotatedCode)

  console.log({ codeStep })

  return codeStep
}

// 0 - normalize

function normalize(text: string | null | undefined) {
  // TODO replace tabs with spaces?
  return (text || "").trimEnd().concat("\n")
}

// 1 - highlight

type HighlightedToken = {
  content: string
  props: { style?: React.CSSProperties }
}

export type HighlightedLine = {
  tokens: HighlightedToken[]
}

function highlight({
  code,
  theme,
  lang,
}: {
  code: string
  theme: EditorTheme
  lang: string
}): HighlightedLine[] {
  const lines = highlightOrPlaceholder(code, lang, theme)
  return lines.map((line, i) => ({
    tokens: line.map(([content, props]) => ({
      content,
      props,
    })),
  }))
}

// 2 - merge lines

type Movement = "enter" | "exit" | "stay"

export type MergedLine = {
  tokens: HighlightedToken[]
  lineNumber: Tween<number>
  move: Movement
  enterIndex: null | number
  exitIndex: null | number
}

export interface MergedCode {
  lines: MergedLine[]
  enterCount: number
  exitCount: number
}

function merge(
  code: FullTween<string>,
  highlightedLines: FullTween<HighlightedLine[]>
): MergedCode {
  return mergeLines(code, highlightedLines)
}

// 3 - parse annotationss

export type MultiLineAnnotation = {
  /* line numbers (starting at 1) */
  lineNumbers: { start: number; end: number }
  Component: (props: {
    style: React.CSSProperties
    children: React.ReactNode
  }) => React.ReactElement
}

export type InlineAnnotation = {
  /* column numbers (starting at 1) */
  columnNumbers: { start: number; end: number }
  Component: (props: {
    style?: React.CSSProperties
    children: React.ReactNode
  }) => React.ReactElement
}

function parseAllAnnotations(
  annotations: Tween<CodeAnnotation[]> | undefined,
  theme: EditorTheme
) {
  return parseAnnotations(annotations, theme)
}

// 4 - split lines by focus

export type TokenGroup = {
  tokens: HighlightedToken[]
  focused: FullTween<boolean>
  element: React.ReactNode
}

export interface FocusedLine
  extends Omit<MergedLine, "tokens"> {
  groups: TokenGroup[]
  lineNumber: Tween<number>
  focused: FullTween<boolean>
}

export interface FocusedCode
  extends Omit<MergedCode, "lines"> {
  lines: FocusedLine[]
  firstFocusedLineNumber: FullTween<number>
  lastFocusedLineNumber: FullTween<number>
}

function splitLinesByFocus(
  mergedCode: MergedCode,
  focus: FullTween<FocusString>,
  annotations: FullTween<
    Record<number, InlineAnnotation[] | undefined>
  >
): FocusedCode {
  return splitByFocus(mergedCode, focus, annotations)
}

// 4 - convert annotations

// function parseAnnotations(
//   annotations: Tween<CodeAnnotation[]> | undefined,
//   theme: EditorTheme
// ): FullTween<MultiLineAnnotation[]> {
//   return mapWithDefault(annotations, [], annotations => {
//     return annotations.map(a => toLinesAnnotation(a, theme))
//   })
// }

// function toLinesAnnotation(
//   annotation: CodeAnnotation,
//   theme: EditorTheme
// ): MultiLineAnnotation {
//   if (annotation.Component) {
//     return {
//       Component: annotation.Component,
//       focus: annotation.focus,
//     }
//   }

//   // TODO handle missing bg
//   const bg = ((theme as any).colors[
//     "editor.lineHighlightBackground"
//   ] ||
//     (theme as any).colors[
//       "editor.selectionHighlightBackground"
//     ]) as string

//   function Component({
//     style,
//     children,
//   }: {
//     style: React.CSSProperties
//     children: React.ReactNode
//   }) {
//     return (
//       <div
//         style={{
//           ...style,
//           background: bg,
//           cursor: "pointer",
//         }}
//         onClick={_ => alert("clicked")}
//       >
//         {children}
//       </div>
//     )
//   }

//   return {
//     Component,
//     focus: annotation.focus,
//   }
// }

// 5 - add annotations

export type AnnotatedTokenGroups = {
  groups: TokenGroup[]
  annotation?: InlineAnnotation
}

export interface AnnotatedLine
  extends Omit<FocusedLine, "groups"> {
  annotatedGroups: Tween<AnnotatedTokenGroups>[]
}

export type LineGroup = {
  annotation?: CodeAnnotation
  lines: AnnotatedLine[]
}
export interface AnnotatedCode
  extends Omit<FocusedCode, "lines"> {
  lines: AnnotatedLine[]
  groups: FullTween<LineGroup[]>
  firstFocusedLineNumber: FullTween<number>
  lastFocusedLineNumber: FullTween<number>
}

function addAnnotations(
  { lines, ...focusedCode }: FocusedCode,
  inlineAnnotations: FullTween<
    Record<number, InlineAnnotation[] | undefined>
  >,
  annotations: FullTween<MultiLineAnnotation[]>
): AnnotatedCode {
  const annotatedLines = annotateInline(
    lines,
    inlineAnnotations
  ) as AnnotatedLine[]

  const lineGroups = splitByAnnotations(
    annotatedLines,
    annotations
  )

  return {
    ...focusedCode,
    lines: annotatedLines,
    groups: lineGroups,
  }
}

// - add extra stuff

export type LineWithElement = AnnotatedLine & {
  key: number
  tweenX: TweenParams
  tweenY: TweenParams
}
type LineGroupWithElement = {
  annotation?: CodeAnnotation
  lines: LineWithElement[]
}

export type CodeStep = {
  lines: LineWithElement[]
  groups: FullTween<LineGroupWithElement[]>
  firstFocusedLineNumber: FullTween<number>
  lastFocusedLineNumber: FullTween<number>
  verticalInterval: [number, number]
}

function addExtraStuff(codeStep: AnnotatedCode): CodeStep {
  const vInterval = verticalInterval(
    codeStep.enterCount,
    codeStep.exitCount
  )

  const newLines = getLinesWithElements(
    codeStep.lines,
    vInterval,
    codeStep.enterCount,
    codeStep.exitCount
  )

  const newGroups = map(codeStep.groups, groups =>
    groups.map(group => ({
      ...group,
      // TODO add annotations
      lines: getLinesWithElements(
        group.lines,
        vInterval,
        codeStep.enterCount,
        codeStep.exitCount
      ),
    }))
  )

  return {
    ...codeStep,
    lines: newLines,
    groups: newGroups,
    verticalInterval: vInterval,
  }
}

function verticalInterval(
  enterCount: number,
  exitCount: number
): [number, number] {
  if (enterCount <= 0 && exitCount <= 0) return [0, 1]
  if (enterCount <= 0 && exitCount >= 1) return [0.33, 1]
  if (enterCount >= 1 && exitCount <= 0) return [0, 0.67]
  return [0.25, 0.75]
}
