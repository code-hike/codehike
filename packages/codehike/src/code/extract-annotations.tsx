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
  const regular: Annotation[] = []
  const starts: { name: string; query: string; line: number }[] = []
  const ends: { name: string; query: string; line: number }[] = []

  for (const a of annotations) {
    const q = a.query ?? ""
    if (q.startsWith(START_MARKER)) {
      starts.push({
        name: a.name,
        query: q.slice(START_MARKER.length),
        line: getLineFromRange(a.ranges[0]),
      })
    } else if (q.startsWith(END_MARKER)) {
      ends.push({
        name: a.name,
        query: q.slice(END_MARKER.length),
        line: getLineFromRange(a.ranges[0]),
      })
    } else {
      regular.push(a)
    }
  }

  if (starts.length === 0 && ends.length === 0) {
    return annotations
  }

  const paired: Annotation[] = []
  const usedEnds = new Set<number>()

  for (const start of starts) {
    // find the first unused end with the same name that comes after the start
    const endIndex = ends.findIndex(
      (e, i) =>
        !usedEnds.has(i) &&
        e.name === start.name &&
        e.line >= start.line,
    )
    if (endIndex === -1) {
      console.warn(
        `Code Hike warning: Unmatched !${start.name}(start) annotation`,
      )
      continue
    }
    usedEnds.add(endIndex)
    const end = ends[endIndex]
    paired.push({
      name: start.name,
      query: start.query,
      ranges: [
        { fromLineNumber: start.line, toLineNumber: end.line - 1 },
      ],
    })
  }

  for (let i = 0; i < ends.length; i++) {
    if (!usedEnds.has(i)) {
      console.warn(
        `Code Hike warning: Unmatched !${ends[i].name}(end) annotation`,
      )
    }
  }

  return [...regular, ...paired]
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
      rangeString = undefined
    } else if (rangeString === "(end)") {
      query = END_MARKER + query
      rangeString = undefined
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
