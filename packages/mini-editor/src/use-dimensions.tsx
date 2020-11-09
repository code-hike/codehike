import React from "react"

type Dimensions = {
  width: number
  height: number
  deps: React.DependencyList
  lineWidths: [number, number]
  lineHeight: number
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
  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()

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
      setDimensions({
        width: rect.width,
        height: rect.height,
        lineWidths: [
          plw || nlw || DEFAULT_WIDTH,
          nlw || plw || DEFAULT_WIDTH,
        ],
        lineHeight: Math.max(plh, nlh),
        deps,
      })
    }
  }, deps)

  if (!dimensions || depsChanged(dimensions.deps, deps)) {
    return [ref, null]
  } else {
    return [ref, dimensions]
  }
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
