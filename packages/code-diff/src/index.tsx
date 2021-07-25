import { diffLines } from "diff"
import { IRawTheme } from "vscode-textmate"
import { useHighlighter } from "./highlighter"
import React from "react"
import { Tween, mapWithDefault } from "@code-hike/utils"

type DiffOptions = {
  code: Tween<string>
  lang: string
  theme: IRawTheme
}

type CodeToken = [
  string,
  {
    className?: string
    style?: { color: string | undefined }
  }
]
type CodeLine = CodeToken[]

type CodeMap = {
  [key: number]: CodeLine
}

export { CodeLine, DiffOptions, CodeMap, useCodeDiff }

function useCodeDiff({ code, lang, theme }: DiffOptions) {
  const normalCode = mapWithDefault(code, "", normalize)
  const { lines, bg, fg } = useHighlighter(
    normalCode,
    lang,
    theme
  )

  return React.useMemo(() => {
    const prevKeys = Array.from(
      { length: lines.prev.length - 1 },
      (x, i) => i + 1
    )
    const nextKeys = getNextKeys(
      normalCode.prev,
      normalCode.next,
      prevKeys
    )

    const codeMap: CodeMap = {}
    prevKeys.forEach(
      (key, index) => (codeMap[key] = lines.prev[index])
    )
    nextKeys.forEach(
      (key, index) => (codeMap[key] = lines.next[index])
    )

    return {
      keys: { prev: prevKeys, next: nextKeys },
      codeMap,
      backgroundColor: bg,
      color: fg,
    }
  }, [lines.prev, lines.next, bg, fg])
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

function normalize(text: string | null | undefined) {
  return (text || "").trimEnd().concat("\n")
}
