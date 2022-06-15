import React from "react"
import { CodeAnnotation } from "../smooth-code"
import { getColor, transparent, ColorName } from "../utils"

export function Annotation() {
  return "error: code hike remark plugin not running or annotation isn't at the right place"
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
  theme,
}: {
  data: string
  children: React.ReactNode
  style?: React.CSSProperties
  theme?: any
}) {
  const className = `ch-code-multiline-mark ` + (data ?? "")
  const bg = getColor(
    theme,
    ColorName.RangeHighlightBackground
  )
  const border = getColor(
    theme,
    ColorName.EditorInfoForeground
  )

  return (
    <div
      style={{ ...style, background: bg }}
      className={className}
    >
      <span
        className="ch-code-multiline-mark-border"
        style={{ background: border }}
      />
      {children}
    </div>
  )
}

function InlineMark({
  children,
  data,
  theme,
}: {
  data: any
  children: React.ReactNode
  theme: any
}) {
  const bg =
    tryGuessColor(children) ||
    transparent(
      getColor(theme, ColorName.CodeForeground),
      0.2
    )

  const className = "ch-code-inline-mark " + (data ?? "")
  return (
    <span className={className} style={{ background: bg }}>
      {children}
    </span>
  )
}

function tryGuessColor(
  children: React.ReactNode
): string | undefined {
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
}

function Box({
  children,
  data,
  theme,
}: {
  data: any
  children: React.ReactNode
  theme: any
}) {
  const border =
    typeof data === "string"
      ? data
      : theme.tokenColors.find((tc: any) =>
          tc.scope?.includes("string")
        )?.settings?.foreground || "yellow"
  return (
    <span
      className="ch-code-box-annotation"
      style={{ outline: `2px solid ${border}` }}
    >
      {children}
    </span>
  )
}

function WithClass({
  children,
  data,
  style,
  theme,
}: {
  data: any
  children: React.ReactNode
  style?: React.CSSProperties
  theme: any
}) {
  const className = data as string
  return (
    <span style={style} className={className}>
      {children}
    </span>
  )
}

function Label({
  children,
  data,
  style,
  theme,
}: {
  data: any
  children: React.ReactNode
  style?: React.CSSProperties
  theme?: any
}) {
  const bg = ((theme as any).colors[
    "editor.lineHighlightBackground"
  ] ||
    (theme as any).colors[
      "editor.selectionHighlightBackground"
    ]) as string
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
  data,
}: {
  data:
    | {
        url: string
        title: string | undefined
      }
    | string
  children: React.ReactNode
}) {
  const url = (data as any)?.url || data
  const title = (data as any)?.title
  return (
    <a
      href={url}
      title={title}
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        color: "inherit",
      }}
    >
      {children}
    </a>
  )
}
