import React from "react"

type MiniBrowserStep = {
  /**
   * The url to display on the navigation bar.
   */
  url?: string
  /**
   * Override the url used for the iframe and "Open in new tab" button.
   */
  loadUrl?: string
  /**
   * Scale the content of the browser.
   */
  zoom?: number
  /**
   * Prepend the current origin to the url.
   */
  prependOrigin?: boolean
  /**
   * The content to display in the browser. If not provided, an iframe for the url will be displayed.
   */
  children?: React.ReactNode
}

type InternalStep = {
  displayUrl?: string
  loadUrl?: string
  children?: React.ReactNode
  zoom: number
}

export { useSteps, transformUrl }
export type { MiniBrowserStep }

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
  }, [steps])
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
