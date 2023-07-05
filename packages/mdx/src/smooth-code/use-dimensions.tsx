import React from "react"
import {
  FocusString,
  getFocusExtremes,
  getFocusIndexes,
  Tween,
  useLayoutEffect,
} from "../utils"

type Dimensions = {
  containerWidth: number
  containerHeight: number
  contentWidth: number
  contentHeight: number
  deps: React.DependencyList
  lineWidths: [number, number]
  lineWidth: [number, number]
  lineHeight: number
  colWidth: number
  lineNumberWidth: number
} | null

export { useDimensions }

export type { Dimensions }

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
  lineNumbers: boolean,
  rows: number | "focus" | undefined,
  deps: React.DependencyList
): { element: React.ReactNode; dimensions: Dimensions } {
  const [dimensions, setDimensions] =
    React.useState<Dimensions>(null)

  // in case the element starts hidden https://github.com/code-hike/codehike/issues/372
  const [visibility, markAsVisible] = React.useState(0)

  const windowWidth = useWindowWidth()
  const prevLineRef = React.useRef<HTMLDivElement>(null!)

  // the element to render before dimensions are calculated
  const { prevLongestLine, nextLongestLine, element } =
    React.useMemo(() => {
      const prevLongestLine = getLongestLine(
        code.prev,
        focus.prev
      )
      const nextLongestLine = getLongestLine(
        code.next,
        focus.next
      )

      const lines = (code.prev || code.next!)
        .trimEnd()
        .split(newlineRe)

      const largestLineNumber = Math.max(lines.length, 10)

      if (rows) {
        // make the lines match the requested number of rows
        const heightInLines =
          rows === "focus"
            ? focusHeightInLines(focus, lines)
            : rows
        let i = lines.length

        while (i < heightInLines) {
          lines.push("")
          i++
        }

        // remove extra lines to match the requested rows
        while (i > heightInLines) {
          lines.pop()
          i--
        }

        // if we removed prevLongestLine, add it back
        if (
          prevLongestLine &&
          !lines.includes(prevLongestLine)
        ) {
          lines[lines.length - 1] = prevLongestLine
        }
      }

      // avod setting the ref more than once https://github.com/code-hike/codehike/issues/232
      let prevLineRefSet = false
      const element = (
        <code className="ch-code-scroll-parent">
          <br />
          {lines.map((line, i) => {
            const ref =
              !prevLineRefSet && line === prevLongestLine
                ? prevLineRef
                : undefined
            prevLineRefSet = prevLineRefSet || ref != null
            return (
              <div ref={ref} key={i}>
                {lineNumbers ? (
                  <span className="ch-code-line-number">
                    _{largestLineNumber}
                  </span>
                ) : undefined}
                <div
                  style={{
                    display: "inline-block",
                    // leftPad
                    marginLeft: 16,
                  }}
                >
                  <span>{line}</span>
                </div>
              </div>
            )
          })}
          <br />
        </code>
      )
      return { prevLongestLine, nextLongestLine, element }
    }, [code])

  const allDeps = [
    ...deps,
    windowWidth,
    // prevLongestLine,
    // nextLongestLine,
    minColumns,
    visibility,
  ]

  useLayoutEffect(() => {
    if (prevLineRef.current) {
      const pll = prevLineRef.current
      const contentElement = pll?.parentElement!
      const codeElement = contentElement.parentElement!

      const { width } = codeElement.getBoundingClientRect()
      if (!width && visibility === 0) {
        const resizeObserver = new ResizeObserver(
          ([entry]) => {
            const { width } = entry.contentRect
            if (width) {
              resizeObserver.disconnect()
              markAsVisible(1)
            }
          }
        )
        resizeObserver.observe(codeElement)
        return () => resizeObserver.disconnect()
      }

      // TODO is it clientWidth or clientRect?
      const lineContentDiv = pll?.querySelector(
        ":scope > div"
      ) as HTMLElement

      const lineNumberSpan = pll?.querySelector(
        ":scope > span"
      ) as HTMLElement
      const lnw = lineNumberSpan
        ? getWidthWithPadding(lineNumberSpan)
        : 0

      const plw = getWidthWithoutPadding(lineContentDiv)
      const colWidth = plw / prevLongestLine.length || 1
      const nlw = nextLongestLine.length * colWidth
      const lineHeight =
        getHeightWithoutPadding(lineContentDiv) ?? 20

      const d: Dimensions = {
        containerWidth: getWidthWithoutPadding(
          codeElement.parentElement!
        ),
        containerHeight: getHeightWithoutPadding(
          codeElement.parentElement!
        )!,
        contentWidth: getWidthWithoutPadding(
          contentElement.parentElement!
        ),
        contentHeight: getHeightWithoutPadding(
          contentElement.parentElement!
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
        lineNumberWidth: lnw,
        deps: allDeps,
      }
      setDimensions(d)
    }
    return () => {}
  }, allDeps)

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
function getWidthWithPadding(element: HTMLElement) {
  const computedStyle = getComputedStyle(element)
  return parseFloat(computedStyle.width)
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

function focusHeightInLines(
  focus: Tween<FocusString>,
  lines: any[]
): number {
  const [start, end] = getFocusExtremes(focus.prev, lines)
  return end - start + 1
}
