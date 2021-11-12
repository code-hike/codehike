import React from "react"
import { CodeAnnotation } from "@code-hike/smooth-code"
import { CodeLink } from "./links"
import { Code } from "@code-hike/utils"

function Box({
  children,
  data,
  theme,
}: {
  data: {
    url: string
    title: string | undefined
  }
  children: React.ReactNode
  theme: any
}) {
  const border =
    theme.tokenColors.find((tc: any) =>
      tc.scope?.includes("string")
    )?.settings?.foreground || "yellow"
  return (
    <span style={{ outline: `2px solid ${border}` }}>
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

export function getAnnotationsFromCode(code: Code) {
  const { lines } = code
  let lineNumber = 1
  while (lineNumber <= lines.length) {
    const line = lines[lineNumber - 1]
    const annotation = getAnnotationFromLine(
      line,
      lineNumber
    )
    if (annotation) {
      // remove line
      lines.splice(lineNumber - 1, 1)
    } else {
      lineNumber++
    }
  }
  return []
}

function getAnnotationFromLine(
  line: Code["lines"][0],
  lineNumber: number
): CodeAnnotation | undefined {
  const comment = line.tokens.find(t =>
    t.content.startsWith("//")
  )?.content

  if (!comment) {
    return
  }

  const commentRegex = /\/\/\s+(\w+)(\S*)\s*(.*)/
  const [, key, focus, data] = commentRegex.exec(comment)

  const Component = annotationsMap[key]

  if (!Component) {
    return
  }

  return {
    Component,
    focus,
    data,
  }
}
