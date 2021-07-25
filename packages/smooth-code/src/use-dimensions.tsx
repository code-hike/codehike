import React from "react"
import {
  FocusString,
  getFocusIndexes,
} from "./focus-parser"
import { Tween } from "@code-hike/utils"

type Dimensions = {
  width: number
  height: number
  deps: React.DependencyList
  lineWidths: [number, number]
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
  deps: React.DependencyList
): { element: React.ReactNode; dimensions: Dimensions } {
  const [
    dimensions,
    setDimensions,
  ] = React.useState<Dimensions>(null)

  const windowWidth = useWindowWidth()
  const prevLongestLine = getLongestLine(
    code.prev,
    focus.prev
  )
  const nextLongestLine = getLongestLine(
    code.next,
    focus.next
  )
  const prevLineRef = React.useRef<HTMLDivElement>(null!)
  const nextLineRef = React.useRef<HTMLDivElement>(null!)

  const element = (
    <>
      <div ref={prevLineRef}>
        <div style={{ display: "inline-block" }}>
          <span>{prevLongestLine}</span>
        </div>
      </div>
      <div ref={nextLineRef}>
        <div style={{ display: "inline-block" }}>
          <span>{nextLongestLine}</span>
        </div>
      </div>
    </>
  )

  const allDeps = [
    ...deps,
    windowWidth,
    prevLongestLine,
    nextLongestLine,
  ]

  useLayoutEffect(() => {
    if (prevLineRef.current) {
      const pll = prevLineRef.current
      const nll = nextLineRef.current
      const codeElement =
        pll?.parentElement || nll?.parentElement!

      // TODO is it clientWidth or clientRect?

      const plw = pll?.firstElementChild?.clientWidth
      const nlw = nll?.firstElementChild?.clientWidth
      const plh = pll?.firstElementChild?.clientHeight ?? 20
      const nlh = nll?.firstElementChild?.clientHeight ?? 20
      const colWidth = pll
        ? plw! / (pll.textContent?.length || 1)
        : nlw! / (nll!.textContent?.length || 1)

      const d: Dimensions = {
        width: getWidthWithoutPadding(
          codeElement.parentElement!
        ),
        height: getHeightWithoutPadding(
          codeElement.parentElement!
        ),
        lineWidths: [
          plw || nlw || DEFAULT_WIDTH,
          nlw || plw || DEFAULT_WIDTH,
        ],
        lineHeight: Math.max(plh, nlh),
        colWidth,
        deps: allDeps,
      }
      setDimensions(d)
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
    element.clientWidth -
    parseFloat(computedStyle.paddingLeft) -
    parseFloat(computedStyle.paddingRight)
  )
}
function getHeightWithoutPadding(element: HTMLElement) {
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
