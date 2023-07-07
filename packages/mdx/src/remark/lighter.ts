import {
  highlight,
  extractAnnotations,
  Annotation,
} from "@code-hike/lighter"
import { annotationsMap } from "../mdx-client/annotations"
import { CodeAnnotation } from "../smooth-code"

export type LighterAnnotation = Annotation

const annotationNames = [
  "focus",
  "from",
  ...Object.keys(annotationsMap),
]

export async function extractLighterAnnotations(
  codeWithAnnotations: string,
  lang: string
) {
  return await extractAnnotations(
    codeWithAnnotations,
    lang,
    annotationNames
  )
}

export async function extractAnnotationsFromCode(
  codeWithAnnotations: string,
  lang: string,
  names?: string[]
) {
  const { code, annotations } = await extractAnnotations(
    codeWithAnnotations,
    lang,
    names || annotationNames
  )

  const focusList = [] as string[]

  const codeAnnotations = [] as CodeAnnotation[]

  annotations.forEach(({ name, query, ranges }) => {
    ranges.forEach(range => {
      const focus = rangeString(range)
      if (name === "focus") {
        focusList.push(focus)
      } else {
        const Component = annotationsMap[name]
        if (Component) {
          codeAnnotations.push({
            Component,
            focus: focus,
            data: query,
          })
        }
      }
    })
  })

  return { code, annotations: codeAnnotations }
}

// lighter annotations to CodeAnnotations
export function parseLighterAnnotations(
  annotations: LighterAnnotation[]
) {
  const focusList = [] as string[]
  const codeAnnotations = [] as CodeAnnotation[]
  annotations.forEach(({ name, query, ranges }) => {
    ranges.forEach(range => {
      const focus = rangeString(range)
      if (name === "focus") {
        focusList.push(focus)
      } else {
        const Component = annotationsMap[name]
        if (Component) {
          codeAnnotations.push({
            Component,
            focus: focus,
            data: query,
          })
        } else {
          // this shouldn't happen
          throw new Error(`Unknown annotation ${name}`)
        }
      }
    })
  })
  return {
    annotations: codeAnnotations,
    focus: focusList.join(","),
  }
}

function rangeString(range: Annotation["ranges"][0]) {
  if ("lineNumber" in range) {
    return `${range.lineNumber}[${range.fromColumn}:${range.toColumn}]`
  } else if (range.fromLineNumber === range.toLineNumber) {
    return range.fromLineNumber.toString()
  } else {
    return `${range.fromLineNumber}:${range.toLineNumber}`
  }
}
