import { Code, Root } from "mdast"
import { visit } from "unist-util-visit"

/**
 * Find all codeblocks like:
 *
 * ```jsx
 * !from ./foo/bar.js
 * ```
 * and replace the value with the content of the referenced file.
 */
export async function transformImportedCode(
  tree: Root,
  file?: { history?: string[] },
) {
  const nodes: Code[] = []
  visit(tree, "code", (node) => {
    if (node.value?.startsWith("!from ")) {
      nodes.push(node)
    }
  })

  if (nodes.length === 0) {
    return tree
  }

  const mdxPath = file?.history ? file.history[file.history.length - 1] : null
  await Promise.all(
    nodes.map(async (code) => {
      const fromData = code.value.slice(6).trim()
      const [codepath, range] = fromData?.split(/\s+/) || []
      code.value = await readFile(codepath, mdxPath, range)
    }),
  )

  return tree
}

async function readFile(
  externalCodePath: string,
  mdxFilePath: string | null,
  range: string | undefined,
) {
  const annotationContent = "!from " + mdxFilePath + " " + (range || "")

  // if we don't know the path of the mdx file:
  if (mdxFilePath == null) {
    throw new Error(
      `Code Hike couldn't resolve this annotation:
  ${annotationContent}
  Someone is calling the mdx compile function without setting the path.
  Open an issue on CodeHike's repo for help.`,
    )
  }

  let fs, path

  try {
    fs = (await import("fs")).default
    path = (await import("path")).default
    if (!fs || !fs.readFileSync || !path || !path.resolve) {
      throw new Error("fs or path not found")
    }
  } catch (e: any) {
    e.message = `Code Hike couldn't resolve this annotation:
${annotationContent}
Looks like node "fs" and "path" modules are not available.`
    throw e
  }

  const dir = path.dirname(mdxFilePath)
  const absoluteCodepath = path.resolve(dir, externalCodePath)

  let content: string
  try {
    content = fs.readFileSync(absoluteCodepath, "utf8")
  } catch (e: any) {
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
 ${externalCodePath} 2:5`,
      )
    }
    const lines = content.split("\n")
    content = lines.slice(startLine - 1, endLine).join("\n")
  }

  return content
}
