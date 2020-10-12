import { useMemo } from "react"

type Element = React.ReactNode
type Key = number

export type Line = {
  element: Element
  key: Key
}

type LineData = {
  element: Element
  key: Key
  // the line index in prevLines (null if missing)
  prevIndex: number | null
  // the line index in nextLines (null if missing)
  nextIndex: number | null
  // 0 for the first line entering, 1 for the second...
  enterIndex: number | null
  // 0 for the first line exiting, 1 for the second...
  exitIndex: number | null
}

type TweenParams =
  | { fixed: true; value: number }
  | {
      fixed: false
      from: number
      to: number
      start: number
      end: number
    }

type LineTransition = {
  element: React.ReactNode
  key: number
  tweenY: TweenParams
  tweenX: TweenParams
}

export function tween(params: TweenParams, t: number) {
  if (params.fixed) return params.value
  if (t < params.start) return params.from
  if (t > params.end) return params.to
  const x = (t - params.start) / (params.end - params.start)
  return params.from + x * (params.to - params.from)
}

export function useLineTransitions(
  prevLines: Line[],
  nextLines: Line[]
) {
  return useMemo(
    () => getLineTransitions(prevLines, nextLines),
    [prevLines, nextLines]
  )
}

function getLineTransitions(
  prevLines: Line[],
  nextLines: Line[]
) {
  const sortedKeys = sortUniqueConcat(
    prevLines.map(l => l.key),
    nextLines.map(l => l.key)
  )

  let enterIndex = 0
  let exitIndex = 0
  const linesData: LineData[] = sortedKeys.map(key => {
    const prevIndex = prevLines.findIndex(
      l => l.key === key
    )
    const nextIndex = nextLines.findIndex(
      l => l.key === key
    )

    const prevLine = prevLines[prevIndex]
    const nextLine = nextLines[nextIndex]

    return {
      key,
      element: prevLine?.element || nextLine.element!,
      prevIndex: !prevLine ? null : prevIndex,
      nextIndex: !nextLine ? null : nextIndex,
      enterIndex: !prevLine ? enterIndex++ : null,
      exitIndex: !nextLine ? exitIndex++ : null,
    }
  })

  const enterCount = enterIndex
  const exitCount = exitIndex

  // console.log({ linesData })

  return linesData.map(lineData =>
    getLineTransition(lineData, enterCount, exitCount)
  )
}

function getLineTransition(
  {
    element,
    key,
    prevIndex,
    nextIndex,
    enterIndex,
    exitIndex,
  }: LineData,
  enterCount: number,
  exitCount: number
): LineTransition {
  if (prevIndex == null) {
    return {
      element,
      key,
      tweenY: { fixed: true, value: nextIndex! },
      tweenX: {
        fixed: false,
        from: 1,
        to: 0,
        start: 0.75,
        end: 1,
      },
    }
  }

  if (nextIndex == null) {
    return {
      element,
      key,
      tweenY: { fixed: true, value: prevIndex },
      tweenX: {
        fixed: false,
        from: 0,
        to: -1,
        start: 0,
        end: 0.25,
      },
    }
  }

  return {
    element,
    key,
    tweenY: {
      fixed: false,
      from: prevIndex,
      to: nextIndex,
      start: 0.25,
      end: 0.75,
    },
    tweenX: { fixed: true, value: 0 },
  }
}

function sortUniqueConcat(a: number[], b: number[]) {
  return [...new Set(a.concat(b))].sort((x, y) => x - y)
}
