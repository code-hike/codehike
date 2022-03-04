import { diffLines } from "diff"
import { FullTween, Tween } from "../utils"
import {
  HighlightedLine,
  MergedCode,
  MergedLine,
} from "./partial-step-parser"

export function mergeLines(
  code: FullTween<string>,
  lines: FullTween<HighlightedLine[]>
): MergedCode {
  let enterIndex = 0
  let exitIndex = 0
  const indexes = diff(code)
  const newLines: MergedLine[] = indexes.map(index => {
    if (index.next === undefined) {
      return {
        ...lines.prev[index.prev!],
        lineNumber: {
          prev: index.prev! + 1,
        },
        move: "exit",
        enterIndex: null,
        exitIndex: exitIndex++,
      }
    }
    if (index.prev === undefined) {
      return {
        ...lines.next[index.next!],
        lineNumber: {
          next: index.next! + 1,
        },
        move: "enter",
        enterIndex: enterIndex++,
        exitIndex: null,
      }
    }
    return {
      ...lines.prev[index.prev!],
      lineNumber: {
        prev: index.prev! + 1,
        next: index.next! + 1,
      },
      move: "stay",
      enterIndex: null,
      exitIndex: null,
    }
  })

  return {
    lines: newLines,
    enterCount: enterIndex,
    exitCount: exitIndex,
  }
}

/**
 * Returns a list of pairs of line indexes:
 *
 * For example if lines 2 and 3 were removed
 * and two lines where added at the end:
 *  0 0
 *  1 -
 *  2 -
 *  3 1
 *  - 2
 *  - 3
 */
function diff(code: FullTween<string>): Tween<number>[] {
  const changes = diffLines(code.prev, code.next)
  let indexes = [] as Tween<number>[]
  let prevIndex = 0
  let nextIndex = 0
  changes.forEach(change => {
    if (change.added) {
      for (let i = 0; i < change.count!; i++) {
        indexes.push({ next: nextIndex++ })
      }
    } else if (change.removed) {
      for (let i = 0; i < change.count!; i++) {
        indexes.push({ prev: prevIndex++ })
      }
    } else {
      for (let i = 0; i < change.count!; i++) {
        indexes.push({
          prev: prevIndex++,
          next: nextIndex++,
        })
      }
    }
  })
  return indexes
}
