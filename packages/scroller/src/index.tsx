import React from "react"

export { Scroller, Step }

const ObserverContext = React.createContext<
  IntersectionObserver | undefined
>(undefined)

const useLayoutEffect =
  typeof window !== "undefined"
    ? React.useLayoutEffect
    : React.useEffect

type ScrollerProps = {
  onStepChange: (stepIndex: number) => void
  children: React.ReactNode
  getRootMargin?: (vh: number) => string
}

type StepElement = {
  stepIndex: any
}

function defaultRootMargin(vh: number) {
  return `-${vh / 2 - 2}px 0px`
}

function Scroller({
  onStepChange,
  children,
  getRootMargin = defaultRootMargin,
}: ScrollerProps) {
  const [
    observer,
    setObserver,
  ] = React.useState<IntersectionObserver>()
  const vh = useWindowHeight()

  useLayoutEffect(() => {
    const windowHeight = vh || 0
    const handleIntersect: IntersectionObserverCallback = entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          const stepElement = (entry.target as unknown) as StepElement
          onStepChange(+stepElement.stepIndex)
        }
      })
    }
    const observer = newIntersectionObserver(
      handleIntersect,
      getRootMargin(windowHeight)
    )
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
  rootMargin: string
) {
  try {
    return new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold: 0.000001,
      root: document as any,
    })
  } catch {
    // firefox doesn't like passing `document` as the root
    // it's a shame because it break the scroller inside iframes
    return new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold: 0.000001,
    })
  }
}

function Step({
  as = "section",
  index,
  ...props
}: {
  as: any
  index: number
  children?: React.ReactNode
} & React.HTMLProps<HTMLElement>) {
  const ref = React.useRef<HTMLElement>(null!)
  const observer = React.useContext(ObserverContext)

  useLayoutEffect(() => {
    if (observer) {
      observer.observe(ref.current)
    }
    return () => observer && observer.unobserve(ref.current)
  }, [observer])

  useLayoutEffect(() => {
    const stepElement = (ref.current as unknown) as StepElement
    stepElement.stepIndex = index
  }, [index])

  return React.createElement(as, { ...props, ref })
}

function useWindowHeight() {
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
