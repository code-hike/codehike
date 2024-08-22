import { Annotation, extractAnnotations } from "@code-hike/lighter"

export async function splitAnnotationsAndCode(
  code: string,
  lang: string,
  annotationPrefix: string,
) {
  let annotations: Annotation[] = []
  let codeWithoutAnnotations = code

  const { code: newCode, annotations: newAnnotations } =
    await extractCommentAnnotations(
      codeWithoutAnnotations,
      lang,
      annotationPrefix,
    )
  annotations = [...annotations, ...newAnnotations]
  codeWithoutAnnotations = newCode

  return { code: codeWithoutAnnotations, annotations }
}

async function extractCommentAnnotations(
  code: string,
  lang: string,
  annotationPrefix = "!",
) {
  const extractor = (comment: string) => {
    // const regex = /\s*(!?[\w-]+)?(\([^\)]*\)|\[[^\]]*\])?(.*)$/
    const regex = new RegExp(
      `\\s*(${annotationPrefix}?[\\w-]+)?(\\([^\\)]*\\)|\\[[^\\]]*\\])?(.*)$`,
    )

    const match = comment.match(regex)
    if (!match) {
      return null
    }
    const name = match[1]
    const rangeString = match[2]
    const query = match[3]?.trim()
    if (!name || !name.startsWith(annotationPrefix)) {
      return null
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
