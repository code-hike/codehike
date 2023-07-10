import {
  highlight as light,
  extractAnnotations,
  Annotation,
  LANG_NAMES,
} from "@code-hike/lighter"
import { Code } from "../utils"
import { CodeAnnotation } from "../smooth-code"
import { annotationsMap } from "../mdx-client/annotations"

export type LighterAnnotation = Annotation

export async function extractLighterAnnotations(
  codeWithAnnotations: string,
  lang: string,
  annotationNames: string[]
) {
  return await extractAnnotations(
    codeWithAnnotations,
    warnIfUnknownLang(lang),
    annotationNames
  )
}

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

const warnings = new Set()

function warnIfUnknownLang(lang: string) {
  if (!LANG_NAMES.includes(lang)) {
    if (!warnings.has(lang)) {
      console.warn(
        "[Code Hike warning]",
        `${lang} isn't a valid language, no syntax highlighting will be applied.`
      )
      warnings.add(lang)
    }
    return "text"
  }
  return lang
}

export async function highlight({
  code,
  lang,
  theme,
}: {
  code: string
  lang: string
  theme: any // TODO type this
}): Promise<Code> {
  const r = await light(
    code,
    warnIfUnknownLang(lang),
    theme
  )

  const lines = r.lines.map(line => ({
    tokens: line.map(token => ({
      content: token.content,
      props: { style: token.style },
    })),
  }))

  return { lines, lang: r.lang }
}
