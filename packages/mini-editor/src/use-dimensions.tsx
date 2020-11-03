import React from "react"

type Dimensions = { width: number; height: number } | null

const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

export { useDimensions }

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
      setDimensions({
        width: rect.width,
        height: rect.height,
      })
    }
  }, deps)
  return [ref, dimensions]
}
