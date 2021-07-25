import React from "react"
import { CodeMap } from "@code-hike/code-diff"
import { getFocusByKey, FocusString } from "./focus-parser"
import { FullTween, map } from "@code-hike/utils"
import { ColumnedLine, Line } from "./line-components"

export function useLines(
  focus: FullTween<FocusString>,
  keys: FullTween<number[]>,
  codeMap: CodeMap
) {
  return React.useMemo(() => {
    const prevFocusByKey = getFocusByKey(
      focus.prev,
      keys.prev
    )

    const nextFocusByKey = getFocusByKey(
      focus.next,
      keys.next
    )

    return map(keys, keys => {
      return keys.map(key => {
        const focus = {
          prev: prevFocusByKey[key],
          next: nextFocusByKey[key],
        }
        const focusPerColumn =
          Array.isArray(focus.prev) ||
          Array.isArray(focus.next)
        if (!focusPerColumn) {
          return {
            key,
            element: <Line line={codeMap[key]} />,
          }
        } else {
          return {
            key,
            element: <Line line={codeMap[key]} />,
            elementWithProgress: (progress: number) => (
              <ColumnedLine
                line={codeMap[key]}
                focus={focus}
                progress={progress}
              />
            ),
          }
        }
      })
    })
  }, [focus.prev, focus.next, keys, codeMap])
}
