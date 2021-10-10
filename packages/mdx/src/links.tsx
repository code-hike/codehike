import { Node, Parent } from "unist"
import { CodeStep } from "@code-hike/smooth-code"
import React from "react"

export function CodeLink({
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
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      title={data.title}
      style={{
        textDecoration: "underline",
        textDecorationStyle: "dotted",
      }}
    >
      {children}
    </a>
  )
}

export function extractLinks(
  node: Node,
  index: number,
  parent: Parent,
  code: string
) {
  const annotations = [] as CodeStep["annotations"]

  const nextIndex = index + 1
  while (
    parent.children[nextIndex] &&
    parent.children[nextIndex].type === "definition"
  ) {
    const { identifier, url, title } = parent.children[
      nextIndex
    ]

    const focusList = getFocusList(
      identifier as string,
      code
    )

    focusList.forEach(focus => {
      annotations!.push({
        Component: CodeLink,
        focus,
        data: {
          url: url as string,
          title: title as string | undefined,
        },
      })
    })

    parent.children.splice(nextIndex, 1)
  }
  return annotations!
}

const newlineRe = /\r\n|\r|\n/
function getFocusList(identifier: string, code: string) {
  const lines = code.split(newlineRe)
  const focusList = [] as string[]

  lines.forEach((line, index) => {
    const lineNumber = index + 1
    let re = new RegExp(identifier, "g")
    let match = re.exec(line)
    while (match) {
      const columnStart = match.index + 1
      const columnEnd = columnStart + identifier.length - 1
      focusList.push(
        `${lineNumber}[${columnStart}:${columnEnd}]`
      )
      match = re.exec(line)
    }
  })

  return focusList
}
