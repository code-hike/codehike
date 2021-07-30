import React from "react"
import { CodeMap } from "@code-hike/code-diff"
import { getFocusByKey, FocusString } from "./focus-parser"
import { FullTween, map } from "@code-hike/utils"
import { ColumnedLine, Line } from "./line-components"

export function useLines(
  focus: FullTween<FocusString>,
  codeMap: CodeMap
) {
  return React.useMemo(() => {
    const prevFocusByKey = getFocusByKey(
      focus.prev,
      codeMap.keys.prev
    )

    const nextFocusByKey = getFocusByKey(
      focus.next,
      codeMap.keys.next
    )

    return map(codeMap.keys, keys => {
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
            element: <Line line={codeMap.lines[key]} />,
          }
        } else {
          return {
            key,
            element: <Line line={codeMap.lines[key]} />,
            elementWithProgress: (progress: number) => (
              <ColumnedLine
                line={codeMap.lines[key]}
                focus={focus}
                progress={progress}
              />
            ),
          }
        }
      })
    })
  }, [focus.prev, focus.next, codeMap])
}
