import { diffLines } from "diff"
import { CodeLine, tokenize } from "./tokenizer"

type DiffOptions = {
  prevCode: string
  nextCode: string
  lineKeys?: number[]
  lang: string
}

type CodeMap = {
  [key: number]: CodeLine
}

export { codeDiff, CodeLine, DiffOptions, CodeMap }

function codeDiff({
  prevCode,
  nextCode,
  lineKeys,
  lang,
}: DiffOptions) {
  const prevNormalCode = normalize(prevCode || "")
  const nextNormalCode = normalize(nextCode || "")

  const prevLines = tokenize(prevNormalCode, lang)
  const nextLines = tokenize(nextNormalCode, lang)

  const prevKeys =
    lineKeys ||
    Array.from(
      { length: prevLines.length - 1 },
      (x, i) => i + 1
    )
  const nextKeys = getNextKeys(
    prevNormalCode,
    nextNormalCode,
    prevKeys
  )

  const codeMap: CodeMap = {}
  prevKeys.forEach(
    (key, index) => (codeMap[key] = prevLines[index])
  )
  nextKeys.forEach(
    (key, index) => (codeMap[key] = nextLines[index])
  )

  return { prevKeys, nextKeys, codeMap }
}

function getNextKeys(
  prevCode: string,
  nextCode: string,
  prevKeys: number[]
) {
  const changes = diffLines(prevCode, nextCode)
  const nextKeys: number[] = []
  let prevIndex = 0
  changes.forEach(change => {
    if (change.added) {
      let p =
        prevKeys[prevIndex - 1] != null
          ? prevKeys[prevIndex - 1]
          : prevKeys[prevIndex] - 1
      let n =
        prevKeys[prevIndex] != null
          ? prevKeys[prevIndex]
          : prevKeys[prevKeys.length - 1] + 1
      for (let i = 1; i <= change.count!; i++) {
        nextKeys.push(
          p + ((n - p) * i) / (change.count! + 1)
        )
      }
    } else if (change.removed) {
      prevIndex += change.count!
    } else {
      for (let i = 1; i <= change.count!; i++) {
        nextKeys.push(prevKeys[prevIndex])
        prevIndex++
      }
    }
  })
  return nextKeys
}

function normalize(text: string) {
  return text && text.trimEnd().concat("\n")
}
