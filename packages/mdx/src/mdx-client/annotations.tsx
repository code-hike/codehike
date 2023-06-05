import React from "react"
import { CodeAnnotation } from "../smooth-code"
import { transparent } from "../utils"
import {
  AnnotationProps,
  LineWithElement,
} from "../smooth-code/partial-step-parser"
import { CopyButton } from "../smooth-code/copy-button"
import { CSSV } from "utils/light/css"

export function Annotation() {
  return (
    <div>
      "error: code hike remark plugin not running or
      annotation isn't at the right place"
    </div>
  )
}

export const annotationsMap: Record<
  string,
  CodeAnnotation["Component"]
> = {
  box: Box,
  bg: MultilineMark,
  label: Label,
  link: CodeLink,
  mark: Mark,
  withClass: WithClass,
}

function Mark(props: any) {
  if (props.isInline) {
    return <InlineMark {...props} />
  } else {
    return <MultilineMark {...props} />
  }
}
function MultilineMark({
  children,
  data,
  style,
  lines,
}: {
  data: string
  children: React.ReactNode
  style?: React.CSSProperties
  lines?: LineWithElement[]
}) {
  const content = getContent(lines)
  const className = `ch-code-multiline-mark ` + (data ?? "")

  return (
    <div style={style} className={className}>
      <span className="ch-code-multiline-mark-border" />
      {children}
      <CopyButton
        className="ch-code-button"
        content={content}
      />
    </div>
  )
}

function getContent(lines: LineWithElement[]) {
  return lines
    .map(l =>
      l.annotatedGroups
        .flatMap(ag =>
          ag.prev?.groups.flatMap(tg =>
            tg.tokens.map(t => t.content)
          )
        )
        .join("")
    )
    .join("\n")
}

function InlineMark({ children, data }: AnnotationProps) {
  const className = "ch-code-inline-mark " + (data ?? "")
  return (
    <span
      className={className}
      style={{
        background: tryGuessColor(children) || undefined,
      }}
    >
      {children}
    </span>
  )
}

function tryGuessColor(
  children: React.ReactNode
): string | undefined {
  try {
    const child = React.Children.toArray(children)[0] as any

    const grandChild = React.Children.toArray(
      child?.props?.children || []
    )[0] as any

    const grandGrandChild = React.Children.toArray(
      grandChild?.props?.children || []
    )[0] as any
    const { color } = grandGrandChild?.props?.style || {}

    if (color) {
      return transparent(color as string, 0.2)
    }
    return undefined
  } catch (e) {
    return undefined
  }
}

function Box({ children, data }: AnnotationProps) {
  const outlineColor =
    typeof data === "string" ? data : undefined
  return (
    <span
      className="ch-code-box-annotation"
      style={{ outlineColor }}
    >
      {children}
    </span>
  )
}

function WithClass({
  children,
  data,
  style,
}: AnnotationProps) {
  return (
    <span style={style} className={data as string}>
      {children}
    </span>
  )
}

function Label({ children, data, style }: AnnotationProps) {
  const bg = CSSV.editor.lineHighlightBackground
  const [hover, setHover] = React.useState(false)

  return (
    <div
      style={{
        ...style,
        background: hover ? bg : undefined,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <div
        style={{
          position: "absolute",
          right: 0,
          paddingRight: 16,
          display: hover ? "block" : "none",
          opacity: 0.7,
        }}
      >
        {data?.children || data}
      </div>
    </div>
  )
}

function CodeLink({
  children,
  isInline,
  style,
  data,
}: {
  data:
    | {
        url: string
        title: string | undefined
      }
    | string
  children: React.ReactNode
  isInline: boolean
  style?: React.CSSProperties
}) {
  const url = (data as any)?.url || data
  const title = (data as any)?.title
  return (
    <a
      href={url}
      title={title}
      className={
        isInline ? "ch-code-inline-link" : "ch-code-link"
      }
      style={style}
    >
      {children}
    </a>
  )
}
