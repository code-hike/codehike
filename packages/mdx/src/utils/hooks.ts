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
