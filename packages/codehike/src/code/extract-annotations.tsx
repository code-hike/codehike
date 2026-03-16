import { Annotation, extractAnnotations } from "@code-hike/lighter"

const START_MARKER = "\0start\0"
const END_MARKER = "\0end\0"

export async function splitAnnotationsAndCode(
  code: string,
  lang: string,
  annotationPrefix: string,
) {
  const { code: newCode, annotations: rawAnnotations } =
    await extractCommentAnnotations(code, lang, annotationPrefix)

  const annotations = processStartEndMarkers(rawAnnotations)

  return { code: newCode, annotations }
}

function getLineFromRange(range: any): number {
  if (range.lineNumber) return range.lineNumber
  return range.fromLineNumber
}

function processStartEndMarkers(annotations: Annotation[]): Annotation[] {
  const stacks = new Map<
    string,
    { name: string; query: string; line: number; order: number }[]
  >()
  const orderedAnnotations: { order: number; annotation: Annotation }[] = []

  for (const [order, a] of annotations.entries()) {
    const q = a.query ?? ""
    if (q.startsWith(START_MARKER)) {
      const start = {
        name: a.name,
        query: q.slice(START_MARKER.length),
        line: getLineFromRange(a.ranges[0]),
        order,
      }
      const stack = stacks.get(a.name) ?? []
      stack.push(start)
      stacks.set(a.name, stack)
    } else if (q.startsWith(END_MARKER)) {
      const stack = stacks.get(a.name)
      const start = stack?.pop()
      if (!start) {
        console.warn(
          `Code Hike warning: Unmatched !${a.name}(end) annotation`,
        )
        continue
      }

      const endLine = getLineFromRange(a.ranges[0]) - 1
      if (endLine < start.line) {
        console.warn(
          `Code Hike warning: Empty !${a.name} start/end annotation range`,
        )
        continue
      }

      orderedAnnotations.push({
        order: start.order,
        annotation: {
          name: start.name,
          query: start.query,
          ranges: [{ fromLineNumber: start.line, toLineNumber: endLine }],
        },
      })
    } else {
      orderedAnnotations.push({ order, annotation: a })
    }
  }

  if (orderedAnnotations.length === annotations.length) {
    return annotations
  }

  for (const stack of stacks.values()) {
    for (const start of stack) {
      console.warn(
        `Code Hike warning: Unmatched !${start.name}(start) annotation`,
      )
    }
  }

  orderedAnnotations.sort((a, b) => a.order - b.order)
  return orderedAnnotations.map((entry) => entry.annotation)
}

async function extractCommentAnnotations(
  code: string,
  lang: string,
  annotationPrefix = "!",
) {
  const extractor = (comment: string) => {
    const body = "(?:\\\\.|[^\\\\/])+"
    const nestedBracketRegex = new RegExp(
      `\\s*(${annotationPrefix}?[\\w-]+)?(\\[\\/${body}\\/[a-zA-Z]*\\])(.*)$`,
    )
    const nestedParenRegex = new RegExp(
      `\\s*(${annotationPrefix}?[\\w-]+)?(\\(\\/${body}\\/[a-zA-Z]*\\))(.*)$`,
    )
    const regex = new RegExp(
      `\\s*(${annotationPrefix}?[\\w-]+)?(\\([^\\)]*\\)|\\[[^\\]]*\\])?(.*)$`,
    )

    const match =
      comment.match(nestedBracketRegex) ||
      comment.match(nestedParenRegex) ||
      comment.match(regex)
    if (!match) {
      return null
    }
    const name = match[1]
    let rangeString = match[2]
    let query = match[3]?.trim() ?? ""
    if (!name || !name.startsWith(annotationPrefix)) {
      return null
    }

    // Handle start/end range markers: !name(start) and !name(end)
    if (rangeString === "(start)") {
      query = START_MARKER + query
      rangeString = "(1)"
    } else if (rangeString === "(end)") {
      query = END_MARKER + query
      rangeString = "(1)"
    }

    return {
      name: name.slice(annotationPrefix.length),
      rangeString,
      query,
    }
  }

  const { code: codeWithoutComments, annotations } = await extractAnnotations(
    code,
    lang,
    extractor,
  )
  return { code: codeWithoutComments, annotations }
}
