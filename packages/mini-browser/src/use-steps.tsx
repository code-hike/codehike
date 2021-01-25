import React from "react"

type MiniBrowserStep = {
  url?: string
  loadUrl?: string
  children?: React.ReactNode
  zoom?: number
  prependOrigin?: boolean
}

export { useSteps, MiniBrowserStep }

function useSteps(
  ogSteps: MiniBrowserStep[] | undefined,
  ogDefaults: MiniBrowserStep
) {
  const defaults = transformStep(ogDefaults)
  const {
    zoom,
    url,
    children,
    loadUrl,
    prependOrigin,
  } = defaults

  return React.useMemo(() => {
    if (!ogSteps) {
      return [defaults]
    } else {
      return ogSteps.map(s => {
        const step = transformStep({
          prependOrigin,
          ...s,
        })
        return {
          zoom,
          url,
          children,
          ...step,
          loadUrl: step.loadUrl || step.url || loadUrl,
        }
      })
    }
  }, [ogSteps, zoom, url, children, loadUrl, prependOrigin])
}

function transformStep(step: MiniBrowserStep) {
  const currentOrigin =
    typeof window !== "undefined" ? window.origin : ""
  const url =
    step.url && step.prependOrigin === true
      ? currentOrigin + step.url
      : step.url
  const loadUrl = step.loadUrl || url

  const transformed = { ...step, loadUrl }
  if (step.url) {
    transformed.url = url
  }
  return transformed
}
