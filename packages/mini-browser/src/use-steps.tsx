import React from "react"

type MiniBrowserStep = {
  url?: string
  loadUrl?: string
  children?: React.ReactNode
  zoom?: number
  prependOrigin?: boolean
}

type InternalStep = {
  displayUrl?: string
  loadUrl?: string
  children?: React.ReactNode
  zoom: number
}

export { useSteps, MiniBrowserStep, transformUrl }

function useSteps(
  steps: MiniBrowserStep[] | undefined
): InternalStep[] {
  return React.useMemo(() => {
    if (!steps) {
      return [{ zoom: 1 }]
    }
    return steps.map(step => {
      const { displayUrl, loadUrl } = transformUrl(
        step.url,
        step.loadUrl,
        step.prependOrigin
      )
      return {
        zoom: step.zoom || 1,
        displayUrl,
        loadUrl,
        children: step.children,
      }
    })
  }, steps)
}

function transformUrl(
  url: string | undefined,
  loadUrl: string | undefined,
  prependOrigin: boolean | undefined
) {
  const currentOrigin =
    typeof window !== "undefined" ? window.origin : ""
  const displayUrl =
    url && prependOrigin === true
      ? currentOrigin + url
      : url
  return { displayUrl, loadUrl: loadUrl || displayUrl }
}
