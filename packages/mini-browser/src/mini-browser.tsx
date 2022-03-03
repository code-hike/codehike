import React from "react"
import { useSpring } from "use-spring"
import {
  MiniBrowserHike,
  MiniBrowserHikeProps,
} from "./mini-browser-hike"
import { MiniBrowserStep } from "./use-steps"

export type MiniBrowserProps = Omit<
  MiniBrowserHikeProps,
  "progress" | "steps" | "backward"
> &
  MiniBrowserStep

export { MiniBrowser }

function MiniBrowser({
  url,
  loadUrl,
  prependOrigin,
  children,
  zoom,
  ...rest
}: MiniBrowserProps) {
  const [steps, progress] = useSteps({
    url,
    loadUrl,
    prependOrigin,
    children,
    zoom,
  })

  return (
    <MiniBrowserHike
      {...rest}
      steps={steps}
      progress={progress}
    />
  )
}

function useSteps({
  url,
  loadUrl,
  prependOrigin,
  children,
  zoom,
}: MiniBrowserStep) {
  const [state, setState] = React.useState({
    target: 0,
    steps: [
      { url, loadUrl, prependOrigin, children, zoom },
    ],
  })

  React.useEffect(() => {
    const last = state.steps[state.steps.length - 1]
    if (
      last.url !== url ||
      last.loadUrl !== loadUrl ||
      last.prependOrigin !== prependOrigin ||
      last.children !== children
    ) {
      setState(s => ({
        target: s.target + 1,
        steps: [
          ...s.steps,
          { url, loadUrl, prependOrigin, children, zoom },
        ],
      }))
    }
  }, [url, loadUrl, prependOrigin, children, zoom])

  const [progress] = useSpring(state.target, {
    stiffness: 100,
    decimals: 3,
  })

  return [state.steps, progress] as const
}
