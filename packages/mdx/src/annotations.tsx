import React from "react"
import { CodeAnnotation } from "@code-hike/smooth-code"
import { CodeLink } from "./links"

function Box({
  children,
  data,
}: {
  data: {
    url: string
    title: string | undefined
  }
  children: React.ReactNode
}) {
  return (
    <span style={{ outline: "2px solid yellow" }}>
      {children}
    </span>
  )
}

function Background({
  children,
  data,
  style,
  theme,
}: {
  data: {
    url: string
    title: string | undefined
  }
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
  return (
    <div
      style={{
        ...style,
        background: bg,
        cursor: "pointer",
      }}
      // onClick={_ => alert("clicked")}
    >
      {children}
    </div>
  )
}

function Label() {
  return <div></div>
}

export const annotationsMap: Record<
  string,
  CodeAnnotation["Component"]
> = {
  box: Box,
  bg: Background,
  label: Label,
  link: CodeLink,
}

export function getAnnotationsFromMetastring(
  options: Record<string, string>
) {
  const annotations = [] as CodeAnnotation[]
  Object.keys(options).forEach(key => {
    const Component = annotationsMap[key]
    if (Component) {
      annotations?.push({ focus: options[key], Component })
    }
  })
  return annotations
}
