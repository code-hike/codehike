import React from "react"

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

export { useDimensions }

const DEFAULT_WIDTH = 200

function useDimensions<T extends HTMLElement>(
  deps: React.DependencyList
): [React.MutableRefObject<T>, Dimensions] {
  const ref = React.useRef<T>(null!)
  const [dimensions, setDimensions] = React.useState<
    Dimensions
  >(null)

  const windowWidth = useWindowWidth()
  const fullDeps = [...deps, windowWidth]

  useLayoutEffect(() => {
    if (ref.current) {
      const pll = ref.current.querySelector(
        ".prev-longest-line"
      )
      const nll = ref.current.querySelector(
        ".next-longest-line"
      )

      // TODO is it clientWidth or clientRect?

      const plw = pll?.firstElementChild?.clientWidth
      const nlw = nll?.firstElementChild?.clientWidth
      const plh = pll?.firstElementChild?.clientHeight ?? 20
      const nlh = nll?.firstElementChild?.clientHeight ?? 20
      const colWidth = pll
        ? plw! / (pll.textContent?.length || 1)
        : nlw! / (nll!.textContent?.length || 1)
      setDimensions({
        width: getWidthWithoutPadding(ref.current),
        height: getHeightWithoutPadding(ref.current),
        lineWidths: [
          plw || nlw || DEFAULT_WIDTH,
          nlw || plw || DEFAULT_WIDTH,
        ],
        lineHeight: Math.max(plh, nlh),
        colWidth,
        deps: fullDeps,
      })
    }
  }, fullDeps)

  if (
    !dimensions ||
    depsChanged(dimensions.deps, fullDeps)
  ) {
    return [ref, null]
  } else {
    return [ref, dimensions]
  }
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
