import React from "react"
import {
  FocusString,
  getFocusIndexes,
  Tween,
} from "@code-hike/utils"

type Dimensions = {
  containerWidth: number
  containerHeight: number
  deps: React.DependencyList
  lineWidths: [number, number]
  lineWidth: [number, number]
  lineHeight: number
  colWidth: number
} | null

const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

export { useDimensions, Dimensions }

const DEFAULT_WIDTH = 200

// type DimensionsResult = {
//   width: number
//   height: number
//   lineWidths: { prev: number; next: number }
//   lineHeight: number
//   colWidth: number
// }

function useDimensions(
  code: Tween<string>,
  focus: Tween<FocusString>,
  minColumns: number,
  deps: React.DependencyList
): { element: React.ReactNode; dimensions: Dimensions } {
  const [
    dimensions,
    setDimensions,
  ] = React.useState<Dimensions>(null)

  const windowWidth = useWindowWidth()
  const prevLineRef = React.useRef<HTMLDivElement>(null!)

  const {
    prevLongestLine,
    nextLongestLine,
    element,
  } = React.useMemo(() => {
    const prevLongestLine = getLongestLine(
      code.prev,
      focus.prev
    )
    const nextLongestLine = getLongestLine(
      code.next,
      focus.next
    )
    const lines = (code.prev || code.next!)
      .trim()
      .split(newlineRe)

    const element = (
      <>
        <br />
        {lines.map((line, i) => (
          <div
            ref={
              line === prevLongestLine
                ? prevLineRef
                : undefined
            }
            key={i}
          >
            <div style={{ display: "inline-block" }}>
              <span>{line}</span>
            </div>
          </div>
        ))}
        <br />
      </>
    )
    return { prevLongestLine, nextLongestLine, element }
  }, [code])

  const allDeps = [
    ...deps,
    windowWidth,
    prevLongestLine,
    nextLongestLine,
    minColumns,
  ]

  useLayoutEffect(() => {
    if (prevLineRef.current) {
      const pll = prevLineRef.current
      const codeElement = pll?.parentElement!

      // TODO is it clientWidth or clientRect?

      const plw = getWidthWithoutPadding(
        pll?.firstElementChild as HTMLElement
      )
      const colWidth = plw / prevLongestLine.length || 1
      const nlw = nextLongestLine.length * colWidth
      const lineHeight =
        getHeightWithoutPadding(
          pll?.firstElementChild as HTMLElement
        ) ?? 20

      const d: Dimensions = {
        containerWidth: getWidthWithoutPadding(
          codeElement.parentElement!
        ),
        containerHeight: getHeightWithoutPadding(
          codeElement.parentElement!
        )!,
        lineWidths: [
          plw || nlw || DEFAULT_WIDTH,
          nlw || plw || DEFAULT_WIDTH,
        ],
        lineWidth: [
          Math.max(
            plw || nlw || DEFAULT_WIDTH,
            colWidth * minColumns
          ),
          Math.max(
            nlw || plw || DEFAULT_WIDTH,
            colWidth * minColumns
          ),
        ],
        lineHeight,
        colWidth,
        deps: allDeps,
      }
      setDimensions(d)
      // console.log({ d })
    }
  }, [allDeps])

  if (
    !dimensions ||
    depsChanged(dimensions.deps, allDeps)
  ) {
    return { element, dimensions: null }
  } else {
    return { element, dimensions }
  }
}

const newlineRe = /\r\n|\r|\n/
function getLongestLine(
  code: string | undefined,
  focus: FocusString
): string {
  const lines = code ? code.split(newlineRe) : [""]
  const focusIndexes = getFocusIndexes(focus, lines)
  let longestLine = ""
  lines.forEach((line, index) => {
    if (
      focusIndexes.includes(index) &&
      line.length > longestLine.length
    ) {
      longestLine = line
    }
  })
  return longestLine
}

function getWidthWithoutPadding(element: HTMLElement) {
  const computedStyle = getComputedStyle(element)
  return (
    parseFloat(computedStyle.width) -
    parseFloat(computedStyle.paddingLeft) -
    parseFloat(computedStyle.paddingRight)
  )
}
function getHeightWithoutPadding(
  element: HTMLElement | null
) {
  if (!element) return null
  const computedStyle = getComputedStyle(element)
  return (
    parseFloat(computedStyle.height) -
    parseFloat(computedStyle.paddingTop) -
    parseFloat(computedStyle.paddingBottom)
  )
}

function depsChanged(
  oldDeps: React.DependencyList,
  newDeps: React.DependencyList
) {
  for (let i = 0; i < oldDeps.length; i++) {
    if (oldDeps[i] !== newDeps[i]) return true
  }
  return false
}

function useWindowWidth() {
  const [width, setWidth] = React.useState<
    number | undefined
  >(undefined)
  React.useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () =>
      window.removeEventListener("resize", handleResize)
  }, [])
  return width
}
