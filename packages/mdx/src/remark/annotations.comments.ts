import { CodeAnnotation } from "smooth-code"
import {
  LighterAnnotation,
  extractLighterAnnotations,
  parseLighterAnnotations,
} from "./lighter"
import { annotationsMap } from "../mdx-client/annotations"

const annotationNames = Object.keys(annotationsMap)

export async function splitCodeAndAnnotations(
  rawCode: string,
  lang: string,
  config: { filepath?: string; autoLink?: boolean }
): Promise<{
  code: string
  annotations: CodeAnnotation[]
  focus: string
}> {
  let { code, annotations } =
    await extractLighterAnnotations(rawCode, lang, [
      ...annotationNames,
      "from",
      "focus",
    ])

  // import external code if needed and re-run annotations extraction
  const fromAnnotations = annotations.filter(
    a => a.name === "from"
  )
  if (fromAnnotations.length === 1) {
    const fromData = fromAnnotations[0].query?.trim()
    const [codepath, range] = fromData?.split(/\s+/) || []
    const externalFileContent = await readFile(
      codepath,
      config.filepath,
      range
    )

    const result = await extractLighterAnnotations(
      externalFileContent,
      lang,
      [...annotationNames, "focus"]
    )
    code = result.code
    annotations = result.annotations
  }

  if (config.autoLink) {
    const autoLinkAnnotations = findLinkAnnotations(code)
    annotations = [...annotations, ...autoLinkAnnotations]
  }

  return { code, ...parseLighterAnnotations(annotations) }
}

async function readFile(
  externalCodePath: string,
  mdxFilePath: string,
  range: string | undefined
) {
  const annotationContent =
    "from " + mdxFilePath + " " + (range || "")

  let fs, path

  try {
    fs = (await import("fs")).default
    path = (await import("path")).default
    if (!fs || !fs.readFileSync || !path || !path.resolve) {
      throw new Error("fs or path not found")
    }
  } catch (e) {
    e.message = `Code Hike couldn't resolve this annotation:
${annotationContent}
Looks like node "fs" and "path" modules are not available.`
    throw e
  }

  // if we don't know the path of the mdx file:
  if (mdxFilePath == null) {
    throw new Error(
      `Code Hike couldn't resolve this annotation:
  ${annotationContent}
  Someone is calling the mdx compile function without setting the path.
  Open an issue on CodeHike's repo for help.`
    )
  }

  const dir = path.dirname(mdxFilePath)
  const absoluteCodepath = path.resolve(
    dir,
    externalCodePath
  )

  let content: string
  try {
    content = fs.readFileSync(absoluteCodepath, "utf8")
  } catch (e) {
    e.message = `Code Hike couldn't resolve this annotation:
${annotationContent}
${absoluteCodepath} doesn't exist.`
    throw e
  }

  if (range) {
    const [start, end] = range.split(":")
    const startLine = parseInt(start)
    const endLine = parseInt(end)
    if (isNaN(startLine) || isNaN(endLine)) {
      throw new Error(
        `Code Hike couldn't resolve this annotation:
${annotationContent}
The range is not valid. Should be something like:
 ${externalCodePath} 2:5`
      )
    }
    const lines = content.split("\n")
    content = lines.slice(startLine - 1, endLine).join("\n")
  }

  return content
}

const urlRegex = /https?:\/\/[\w\-_.~:/?#[\]@!$&*+,;=%]+/g
function findLinkAnnotations(
  code: string
): LighterAnnotation[] {
  const lines = code.split("\n")

  const annotations: LighterAnnotation[] = []

  lines.forEach((line, i) => {
    let match: RegExpExecArray | null
    while ((match = urlRegex.exec(line)) !== null) {
      const url = match[0]
      const start = match.index
      const end = start + url.length

      annotations.push({
        name: "link",
        query: url,
        ranges: [
          {
            lineNumber: i + 1,
            fromColumn: start + 1,
            toColumn: end + 1,
          },
        ],
      })
    }
  })

  return annotations
}
