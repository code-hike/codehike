import React from "react"

export const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

// for debugging:
// export const useLayoutEffect = (
//   effect: any,
//   deps?: any
// ) => {}

// from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(
  callback: () => void,
  delay: number | null
) {
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    if (!delay && delay !== 0) {
      return undefined
    }

    const id = setInterval(
      () => savedCallback.current(),
      delay
    )

    return () => clearInterval(id)
  }, [delay])
}
