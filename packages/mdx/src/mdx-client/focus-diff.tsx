import { diffLines } from "diff"

export function getDiffFocus(
  oldString: string,
  newString: string
) {
  const diff = diffLines(oldString, newString)

  let newLineIndexes = []
  let lineCount = 1

  diff.forEach(part => {
    if (part.removed) return

    if (!part.added) {
      lineCount += part.count
      return
    }

    let i = 0
    while (i < part.count) {
      newLineIndexes.push(lineCount + i)
      i++
    }
    lineCount += part.count
  })
  const focus = newLineIndexes.join(",")

  return focus
}
