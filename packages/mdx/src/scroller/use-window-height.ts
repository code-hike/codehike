import React from "react"

const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

export function useWindowHeight() {
  const isClient = typeof window === "object"
  function getHeight() {
    return isClient
      ? document.documentElement.clientHeight
      : undefined
  }
  const [windowHeight, setWindowHeight] = React.useState(
    getHeight
  )
  React.useEffect(() => {
    function handleResize() {
      setWindowHeight(getHeight())
    }
    window.addEventListener("resize", handleResize)
    return () =>
      window.removeEventListener("resize", handleResize)
  }, [])
  useLayoutEffect(() => {
    // FIX when a horizontal scrollbar is added after the first layout
    setWindowHeight(getHeight())
  }, [])
  return windowHeight
}
