import React from "react"
import { MiniFrame } from "@code-hike/mini-frame"
import { TitleBar } from "./title-bar"
import { MiniBrowserStep, useSteps } from "./use-steps"
import {
  classNamesWithPrefix,
  Classes,
} from "@code-hike/utils"

export type MiniBrowserProps = {
  progress?: number
  backward?: boolean
  steps?: MiniBrowserStep[]
  classes?: Classes
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

const MiniBrowserHike = React.forwardRef<
  HTMLIFrameElement,
  MiniBrowserProps
>(MiniBrowserWithRef)

const c = classNamesWithPrefix("")

function MiniBrowserWithRef(
  {
    progress = 0,
    backward = false,
    steps: ogSteps,
    classes = {},
    ...props
  }: MiniBrowserProps,
  ref: React.Ref<HTMLIFrameElement>
) {
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
      className={`${c("ch-mini-browser", classes)} ${
        props.className || ""
      }`}
      style={{
        transform: `translateX(${x}px)`,
        opacity: o * o,
        ...props.style,
      }}
      classes={classes}
      titleBar={
        <TitleBar
          url={displayUrl!}
          linkUrl={loadUrl!}
          classes={classes}
        />
      }
    >
      {children || <iframe ref={ref} src={loadUrl} />}
    </MiniFrame>
  )
}

export { MiniBrowserHike }
