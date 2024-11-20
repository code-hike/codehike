import React, { useEffect, useLayoutEffect } from "react"

const ObserverContext = React.createContext<IntersectionObserver | undefined>(
  undefined,
)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export type MarginConfig = string | { top: number; height: number }

export function Scroller({
  onIndexChange,
  triggerPosition = "50%",
  rootMargin,
  children,
}: {
  onIndexChange: (index: number) => void
  triggerPosition?: TriggerPosition
  rootMargin?: MarginConfig
  children: React.ReactNode
}) {
  const [observer, setObserver] = React.useState<IntersectionObserver>()
  const vh = useWindowHeight()
  const ratios = React.useRef<Record<number, number>>({})
  useIsomorphicLayoutEffect(() => {
    const windowHeight = vh || 0
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      let enteringIndex = -1
      entries.forEach((entry) => {
        const index = +entry.target.getAttribute("data-index")!
        ratios.current[index] = entry.intersectionRatio
        if (entry.intersectionRatio > 0) {
          enteringIndex = index
        }
      })

      if (enteringIndex >= 0) {
        // on enter
        onIndexChange(enteringIndex)
      } else {
        // on exit (go tos the higher intersection)
        const sorted = Object.entries(ratios.current).sort(
          ([, a], [, b]) => b - a,
        )
        const [index] = sorted[0]
        if (ratios.current[+index] > 0) {
          onIndexChange(+index)
        }
      }
    }
    const rm = !rootMargin
      ? defaultRootMargin(windowHeight, triggerPosition)
      : typeof rootMargin === "string"
        ? rootMargin
        : `${-rootMargin.top}px 0px ${-(
            windowHeight -
            rootMargin.top -
            rootMargin.height
          )}px`
    const observer = newIntersectionObserver(handleIntersect, rm)
    setObserver(observer)

    return () => observer.disconnect()
  }, [vh])

  return (
    <ObserverContext.Provider value={observer}>
      {children}
    </ObserverContext.Provider>
  )
}

function newIntersectionObserver(
  handleIntersect: IntersectionObserverCallback,
  rootMargin: string,
) {
  try {
    return new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold: 0.000001,
      root: null,
    })
  } catch (e) {
    // console.error({ rootMargin })
    throw e
  }
}

export function ObservedDiv({
  index,
  ...props
}: { index: number } & React.HTMLProps<HTMLDivElement>) {
  const ref = React.useRef<HTMLDivElement>(null)
  const observer = React.useContext(ObserverContext)

  useIsomorphicLayoutEffect(() => {
    if (observer && ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      observer && ref.current && observer.unobserve(ref.current)
    }
  }, [observer])

  return <div ref={ref} {...props} data-index={index} />
}

function useWindowHeight() {
  const isClient = typeof window === "object"
  function getHeight() {
    return isClient ? document.documentElement.clientHeight : undefined
  }
  const [windowHeight, setWindowHeight] = React.useState(getHeight)
  React.useEffect(() => {
    function handleResize() {
      setWindowHeight(getHeight())
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  useIsomorphicLayoutEffect(() => {
    // FIX when a horizontal scrollbar is added after the first layout
    setWindowHeight(getHeight())
  }, [])
  return windowHeight
}

type TriggerPosition = `${number}px` | `${number}%`

function defaultRootMargin(vh: number, triggerPosition = "50%") {
  let y = vh * 0.5

  if (triggerPosition.endsWith("%")) {
    const percent = parseFloat(triggerPosition.replace("%", ""))
    y = vh * (percent / 100)
  } else if (triggerPosition.endsWith("px")) {
    y = parseFloat(triggerPosition.replace("px", ""))
  }

  if (y < 0) {
    y = vh + y
  }

  return `-${y - 2}px 0px -${vh - y - 2}px`
}
