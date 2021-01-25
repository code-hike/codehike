import React from "react"
import { MiniFrame } from "@code-hike/mini-frame"
import { TitleBar } from "./title-bar"
import { MiniBrowserStep, useSteps } from "./use-steps"

export type MiniBrowserProps = {
  progress?: number
  backward?: boolean
  url?: string
  children?: React.ReactNode
  loadUrl?: string
  prependOrigin?: boolean
  zoom?: number
  steps?: MiniBrowserStep[]
  classes?: Record<string, string>
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

const MiniBrowserHike = React.forwardRef<
  HTMLIFrameElement,
  MiniBrowserProps
>(MiniBrowserWithRef)

function MiniBrowserWithRef(
  {
    url = "",
    children,
    progress = 0,
    backward = false,
    zoom = 1,
    steps: ogSteps,
    loadUrl,
    prependOrigin,
    classes = {},
    ...props
  }: MiniBrowserProps,
  ref: React.Ref<HTMLIFrameElement>
) {
  const steps = useSteps(ogSteps, {
    url,
    children,
    zoom,
    loadUrl,
    prependOrigin,
  })

  const stepIndex = backward
    ? Math.floor(progress)
    : Math.ceil(progress)
  const currentStep = steps[stepIndex]
  return (
    <MiniFrame
      {...props}
      zoom={currentStep.zoom}
      className={`ch-mini-browser ${props.className || ""}`}
      classes={classes}
      titleBar={
        <TitleBar
          url={currentStep.url!}
          linkUrl={currentStep.loadUrl!}
          classes={classes}
        />
      }
    >
      {currentStep.children || (
        <iframe
          ref={ref}
          src={currentStep.loadUrl}
          // sandbox={sandbox}
        />
      )}
    </MiniFrame>
  )
}

export { MiniBrowserHike }
