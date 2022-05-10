import { CodeStep } from "../smooth-code"
import { annotationsMap } from "../mdx-client/annotations"
import { SuperNode } from "./nodes"

export function extractLinks(
  node: SuperNode,
  index: number,
  parent: SuperNode,
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
    ] as any

    const focusList = getFocusList(
      identifier as string,
      code
    )

    focusList.forEach(focus => {
      annotations!.push({
        Component: annotationsMap["link"],
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
