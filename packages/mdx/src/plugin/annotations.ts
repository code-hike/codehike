import { Code, relativeToAbsolute } from "@code-hike/utils"
import { CodeAnnotation } from "@code-hike/smooth-code"
import { Node, Parent } from "unist"
import { wrapChildren } from "./to-estree"
import { annotationsMap } from "../client/annotations"

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

export function extractAnnotationsFromCode(code: Code) {
  const { lines } = code
  let lineNumber = 1
  const annotations = [] as CodeAnnotation[]
  const focusList = [] as string[]
  while (lineNumber <= lines.length) {
    const line = lines[lineNumber - 1]
    const { key, focusString, data } = getCommentData(line)
    // console.log({ key, focusString, data })

    const Component = annotationsMap[key!]

    if (Component) {
      const focus = relativeToAbsolute(
        focusString,
        lineNumber
      )
      lines.splice(lineNumber - 1, 1)
      annotations.push({ Component, focus, data })
    } else if (key === "focus") {
      const focus = relativeToAbsolute(
        focusString,
        lineNumber
      )
      lines.splice(lineNumber - 1, 1)
      focusList.push(focus)
    } else {
      lineNumber++
    }
  }
  return [annotations, focusList.join(",")] as const
}

function getCommentData(line: Code["lines"][0]) {
  const comment = line.tokens.find(t =>
    t.content.trim().startsWith("//")
  )?.content

  if (!comment) {
    return {}
  }

  const commentRegex = /\/\/\s+(\w+)(\S*)\s*(.*)/
  const [, key, focusString, data] = commentRegex.exec(
    comment
  )

  return {
    key,
    focusString,
    data,
  }
}

export function extractJSXAnnotations(
  node: Node,
  index: number,
  parent: Parent
) {
  const annotations = [] as CodeAnnotation[]

  const nextIndex = index + 1
  while (
    parent.children[nextIndex] &&
    parent.children[nextIndex].type ===
      "mdxJsxFlowElement" &&
    parent.children[nextIndex].name === "CH.Annotation"
  ) {
    const jsxAnnotation = parent.children[nextIndex] as any

    // copy attributes to props
    const props = {} as any
    jsxAnnotation.attributes.forEach((attr: any) => {
      props[attr.name] = attr.value
    })
    const { as, focus, ...data } = props
    data.children = wrapChildren(
      jsxAnnotation.children || []
    )

    const Component = annotationsMap[as] || as
    annotations.push({
      Component,
      focus,
      data: isEmpty(data) ? undefined : data,
    })
    // console.log(jsxAnnotation)
    parent.children.splice(nextIndex, 1)
  }
  return annotations
}

function isEmpty(obj: any) {
  return Object.keys(obj).length === 0
}
