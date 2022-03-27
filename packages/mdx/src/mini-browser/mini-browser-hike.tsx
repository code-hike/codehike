import React from "react"
import { MiniFrame } from "../mini-frame"
import { TitleBar } from "./title-bar"
import { MiniBrowserStep, useSteps } from "./use-steps"
import { useClasser, Classes } from "../classer"
import { EditorTheme } from "../utils"

type Transition = "none" | "slide"

export type MiniBrowserHikeProps = {
  progress?: number
  backward?: boolean
  classes?: Classes
  steps?: MiniBrowserStep[]
  transition?: Transition
  theme: EditorTheme
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
    transition = "none",
    classes,
    theme,
    ...props
  }: MiniBrowserHikeProps,
  ref: React.Ref<HTMLIFrameElement>
) {
  const c = useClasser("ch-mini-browser", classes)
  const steps = useSteps(ogSteps)

  const stepIndex = Math.round(progress)

  const { zoom, displayUrl, loadUrl, children } =
    steps[stepIndex]

  return (
    <MiniFrame
      {...props}
      zoom={zoom}
      className={`${c("")} ${props.className || ""}`}
      style={{
        ...transitionStyle({ progress, transition }),
        ...props.style,
      }}
      classes={classes}
      titleBar={
        <TitleBar
          url={displayUrl!}
          linkUrl={loadUrl!}
          theme={theme}
        />
      }
      theme={theme}
    >
      {children || <iframe ref={ref} src={loadUrl} />}
    </MiniFrame>
  )
}

function transitionStyle({
  progress,
  transition,
}: {
  progress: number
  transition: Transition
}) {
  if (transition === "slide") {
    const X = 50
    const t = progress - Math.floor(progress)
    const x = t <= 0.5 ? -X * t : X - X * t
    const o = Math.abs(t - 0.5) * 2
    return {
      transform: `translateX(${x}px)`,
      opacity: o * o,
    }
  }
  return {}
}

export { MiniBrowserHike }
