import React from "react"
import {
  SmoothLines,
  LinesAnnotation,
} from "@code-hike/smooth-lines"
import { useDimensions, Dimensions } from "./use-dimensions"
import { useLines } from "line-props"
import { IRawTheme } from "vscode-textmate"
import DEFAULT_THEME from "shiki/themes/dark-plus.json"
import {
  FocusString,
  getFocusIndexes,
  getFocusExtremes,
} from "./focus-parser"
import {
  Tween,
  withDefault,
  FullTween,
  mapWithDefault,
} from "@code-hike/utils"
import { useCodeDiff } from "@code-hike/code-diff"

type HTMLProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>

export type CodeProps = {
  code: Tween<string>
  focus: Tween<FocusString>
  progress: number
  language: string
  parentHeight?: number
  minColumns?: number
  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
  theme?: IRawTheme
  htmlProps?: HTMLProps
  annotations?: Tween<CodeAnnotation[]>
}

type CodeAnnotation = {
  focus: FocusString
  Component?: LinesAnnotation["Component"]
}

export function Code(props: CodeProps) {
  const { code, focus, parentHeight, htmlProps } = props
  const { element, dimensions } = useDimensions(
    code,
    focus,
    [parentHeight]
  )
  return !dimensions ? (
    <BeforeDimensions
      element={element}
      htmlProps={htmlProps}
    />
  ) : (
    <AfterDimensions dimensions={dimensions} {...props} />
  )
}

function BeforeDimensions({
  element,
  htmlProps,
}: {
  element: React.ReactNode
  htmlProps?: HTMLProps
}) {
  return (
    <Wrapper
      htmlProps={htmlProps}
      // avoid scrollbars when measuring
      style={{ overflow: "hidden", opacity: 0 }}
    >
      {element}
    </Wrapper>
  )
}

function AfterDimensions({
  code,
  focus,
  progress,
  language,
  minColumns = 40,
  minZoom = 0.5,
  maxZoom = 1.5,
  horizontalCenter = false,
  htmlProps,
  theme = (DEFAULT_THEME as unknown) as IRawTheme,
  dimensions,
  annotations,
}: CodeProps & { dimensions: NonNullable<Dimensions> }) {
  const {
    keys,
    codeMap,
    backgroundColor,
    color,
  } = useCodeDiff({ code, lang: language, theme })

  const {
    prevFocusIndexes,
    nextFocusIndexes,
  } = React.useMemo(() => {
    return {
      prevFocusIndexes: getFocusIndexes(
        focus.prev,
        keys.prev
      ),
      nextFocusIndexes: getFocusIndexes(
        focus.next,
        keys.next
      ),
    }
  }, [focus.prev, focus.next, keys])

  const lines = useLines(
    withDefault(focus, null),
    keys,
    codeMap
  )

  const linesAnnotations = useAnnotations(
    annotations,
    theme
  )

  return (
    <Wrapper
      htmlProps={htmlProps}
      style={{ opacity: 1, backgroundColor, color }}
    >
      <SmoothLines
        progress={progress}
        containerWidth={dimensions.width}
        containerHeight={dimensions.height}
        lineHeight={dimensions.lineHeight}
        lineWidth={
          dimensions.lineWidths.map(lw =>
            Math.max(lw, dimensions.colWidth * minColumns)
          ) as [number, number]
        }
        prevLines={lines.prev}
        nextLines={lines.next}
        prevFocus={prevFocusIndexes}
        nextFocus={nextFocusIndexes}
        minZoom={minZoom}
        maxZoom={maxZoom}
        center={horizontalCenter}
        annotations={linesAnnotations}
      />
    </Wrapper>
  )
}

function useAnnotations(
  codeAnnotations: Tween<CodeAnnotation[]> | undefined,
  theme: IRawTheme
): FullTween<LinesAnnotation[]> {
  return React.useMemo(() => {
    if (!codeAnnotations) {
      return {
        prev: [] as LinesAnnotation[],
        next: [] as LinesAnnotation[],
      }
    }
    return mapWithDefault(
      codeAnnotations,
      [],
      codeAnnotations => {
        return codeAnnotations.map(a =>
          toLinesAnnotation(a, theme)
        )
      }
    )
  }, [codeAnnotations])
}

function toLinesAnnotation(
  codeAnnotation: CodeAnnotation,
  theme: IRawTheme
): LinesAnnotation {
  const [startIndex, endIndex] = getFocusExtremes(
    codeAnnotation.focus,
    []
  )

  // TODO handle missing bg
  const bg = ((theme as any).colors[
    "editor.lineHighlightBackground"
  ] ||
    (theme as any).colors[
      "editor.selectionHighlightBackground"
    ]) as string

  console.log({ theme, bg })

  function Component({
    style,
    children,
  }: {
    style: React.CSSProperties
    children: React.ReactNode
  }) {
    return (
      <div
        style={{
          ...style,
          background: bg,
          cursor: "pointer",
        }}
        onClick={_ => alert("clicked")}
      >
        {children}
      </div>
    )
  }

  return {
    Component,
    startIndex,
    endIndex,
  }
}

function Wrapper({
  htmlProps,
  style,
  children,
}: {
  htmlProps?: HTMLProps
  style: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <pre
      {...htmlProps}
      style={{
        margin: 0,
        ...style,
        ...htmlProps?.style,
      }}
    >
      <code>{children}</code>
    </pre>
  )
}
