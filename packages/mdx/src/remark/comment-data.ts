import { Code } from "../utils"
import { annotationsMap } from "../mdx-client/annotations"

const validKeys = ["focus", ...Object.keys(annotationsMap)]

export function getCommentData(
  line: Code["lines"][0],
  lang: string
) {
  const result = bashLikeLangs.includes(lang)
    ? bashLikeComment(line)
    : otherComment(line)

  if (!result) {
    return {}
  }

  const [, key, focusString, data] = result

  if (!validKeys.includes(key)) {
    return {}
  }

  return {
    key,
    focusString,
    data,
  }
}

function getTextAfter(
  line: Code["lines"][0],
  prefix: string
) {
  const firstIndex = line.tokens.findIndex(t =>
    t.content.trim().startsWith(prefix)
  )
  if (firstIndex === -1) {
    return undefined
  }
  return line.tokens
    .slice(firstIndex)
    .map(t => t.content)
    .join("")
}

const commentRegex = /\/\/\s+(\w+)(\S*)\s*(.*)/
function otherComment(line: Code["lines"][0]) {
  const comment = getTextAfter(line, "//")

  if (!comment) {
    return []
  }

  const result = commentRegex.exec(comment)

  if (!result) {
    return []
  }

  return result
}

const bashLikeLangs = [
  "bash",
  "sh",
  "shell",
  "python",
  "py",
]
const bashLikeCommentRegex = /#\s+(\w+)(\S*)\s*(.*)/
function bashLikeComment(line: Code["lines"][0]) {
  const comment = getTextAfter(line, "#")

  if (!comment) {
    return []
  }

  const result = bashLikeCommentRegex.exec(comment)

  if (!result) {
    return []
  }

  return result
}
