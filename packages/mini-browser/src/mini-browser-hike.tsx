import React from "react"
import { MiniFrame } from "@code-hike/mini-frame"
import { TitleBar } from "./title-bar"
import { MiniBrowserStep, useSteps } from "./use-steps"
import { useClasser, Classes } from "@code-hike/classer"

export type MiniBrowserHikeProps = {
  progress?: number
  backward?: boolean
  classes?: Classes
  steps?: MiniBrowserStep[]
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

const MiniBrowserHike = React.forwardRef<
  HTMLIFrameElement,
  MiniBrowserHikeProps
>(MiniBrowserWithRef)

function MiniBrowserWithRef(
  {
    progress = 0,
    backward = false,
    steps: ogSteps,
    classes,
    ...props
  }: MiniBrowserHikeProps,
  ref: React.Ref<HTMLIFrameElement>
) {
  const c = useClasser("ch-mini-browser", classes)
  const steps = useSteps(ogSteps)

  // TODO readability and optional
  const X = 50
  const t = progress - Math.floor(progress)
  const x = t <= 0.5 ? -X * t : X - X * t
  const o = Math.abs(t - 0.5) * 2

  // const stepIndex = backward
  //   ? Math.floor(progress)
  //   : Math.ceil(progress)

  const stepIndex = Math.round(progress)

  const { zoom, displayUrl, loadUrl, children } = steps[
    stepIndex
  ]

  return (
    <MiniFrame
      {...props}
      zoom={zoom}
      className={`${c("")} ${props.className || ""}`}
      style={{
        transform: `translateX(${x}px)`,
        opacity: o * o,
        ...props.style,
      }}
      classes={classes}
      titleBar={
        <TitleBar url={displayUrl!} linkUrl={loadUrl!} />
      }
    >
      {children || <iframe ref={ref} src={loadUrl} />}
    </MiniFrame>
  )
}

export { MiniBrowserHike }
