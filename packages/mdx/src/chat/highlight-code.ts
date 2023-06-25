import {
  highlightSync,
  RawTheme,
} from "@code-hike/lighter/dist/browser.esm.mjs"
import { isLangLoaded, isLangSupported } from "./languages"
import { EntryCodeFile, FileInfo } from "./types"

import { diffLines } from "diff"

export function highlightFile(
  fileInfo: FileInfo,
  theme: RawTheme,
  prevFile?: EntryCodeFile
): EntryCodeFile {
  if (!isLangLoaded(fileInfo.lang)) {
    return {
      name: fileInfo.name,
      code: {
        lines: [
          {
            tokens: [
              {
                content: ".",
                props: {
                  style: { color: "transparent" },
                },
              },
            ],
          },
        ],
        lang: fileInfo.lang,
      },
      text: "",
      raw: true,
      focus: "",
      annotations: [],
    }
  }

  const text = getStreamingCode(
    fileInfo.text,
    prevFile?.text
  )
  const result =
    isLangSupported(fileInfo.lang) &&
    isLangLoaded(fileInfo.lang)
      ? highlightSync(text, fileInfo.lang, theme)
      : highlightSync(text, "text", theme)
  const lines = result.lines.map(line => ({
    tokens: line.map(token => ({
      content: token.content,
      props: { style: token.style },
    })),
  }))

  return {
    name: fileInfo.name,
    code: {
      lines,
      lang: fileInfo.lang,
    },
    text,
    focus: getDiffFocus(prevFile?.text || "", text),
    raw: !isLangLoaded(fileInfo.lang),
    annotations: [],
  }
}

function getStreamingCode(
  streamingCode: string,
  oldCode?: string
) {
  if (!streamingCode) return oldCode || ""
  const oldLines = oldCode?.split("\n") ?? []
  const newLines = streamingCode.split("\n")
  const lines = getLines(oldLines, newLines)
  return lines.join("\n")
}

function getLines(
  oldLines: string[],
  newLines: string[]
): string[] {
  if (oldLines.length === 0) return newLines
  if (newLines.length === 0) return oldLines

  const [firstOldLine, ...restOldLines] = oldLines
  const [firstNewLine, ...restNewLines] = newLines
  if (firstOldLine === firstNewLine) {
    // same line
    return [
      firstNewLine,
      ...getLines(restOldLines, restNewLines),
    ]
  }

  const index = restOldLines.findIndex(
    l => l === firstNewLine
  )
  if (index !== -1 && firstNewLine.trim().length > 1) {
    // deleted index+1 lines
    const newRestOldLines = restOldLines.slice(index + 1)
    return [
      firstNewLine,
      ...getLines(newRestOldLines, restNewLines),
    ]
  }

  // added line
  return [firstNewLine, ...getLines(oldLines, restNewLines)]
}

function getDiffFocus(
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
