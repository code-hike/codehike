import React from "react"

export const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

// Returns the same state, even if the state argument changes.
export function useInitialState<T> (value: T | (() => T)) {
  const [initialState] = React.useState(value);
  return initialState;
}

// for debugging:
// export const useLayoutEffect = (
//   effect: any,
//   deps?: any
// ) => {}
