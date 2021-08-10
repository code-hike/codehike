import React from "react"
import {
  SmoothLines as OldSmoothLines,
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
import {
  useStepParser,
  CodeAnnotation,
} from "./step-parser"
import { SmoothLines } from "./smooth-lines"

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

const DEFAULT_MIN_COLUMNS = 40

export function Code(props: CodeProps) {
  const {
    code,
    focus,
    parentHeight,
    htmlProps,
    minColumns = DEFAULT_MIN_COLUMNS,
  } = props
  const { element, dimensions } = useDimensions(
    code,
    focus,
    minColumns,
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
  minColumns = DEFAULT_MIN_COLUMNS,
  minZoom = 0.5,
  maxZoom = 1.5,
  horizontalCenter = false,
  htmlProps,
  theme = (DEFAULT_THEME as unknown) as IRawTheme,
  dimensions,
  annotations,
}: CodeProps & { dimensions: NonNullable<Dimensions> }) {
  const { backgroundColor, color } = useCodeDiff({
    code,
    lang: language,
    theme,
  })

  const stepInfo = useStepParser({
    code,
    theme,
    lang: language,
    focus,
    annotations,
  })

  return (
    <Wrapper
      htmlProps={htmlProps}
      style={{ opacity: 1, backgroundColor, color }}
    >
      <SmoothLines
        progress={progress}
        dimensions={dimensions}
        minZoom={minZoom}
        maxZoom={maxZoom}
        center={horizontalCenter}
        codeStep={stepInfo}
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
