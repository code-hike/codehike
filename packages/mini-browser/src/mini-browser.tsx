import React from "react"
import { Back, Forward, Open } from "./buttons"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import "./mini-browser.css"

type MiniBrowserStep = {
  url?: string
  loadUrl?: string
  children: React.ReactNode
  zoom?: number
  prependOrigin?: boolean
}

type MiniBrowserProps = {
  progress?: number
  backward?: boolean
  url?: string
  children: React.ReactNode
  loadUrl?: string
  prependOrigin?: boolean
  zoom?: number
  steps?: MiniBrowserStep[]
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

const MiniBrowser = React.forwardRef<
  HTMLIFrameElement,
  MiniBrowserStep
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
      titleBar={
        <Bar
          url={currentStep.url!}
          linkUrl={currentStep.loadUrl!}
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

function Bar({
  url,
  linkUrl,
}: {
  url: string
  linkUrl: string
}) {
  return (
    <>
      <FrameButtons />
      <Back />
      <Forward />
      {/* <Refresh /> */}
      <input value={url || ""} readOnly />
      <Open href={linkUrl} />
    </>
  )
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

export { MiniBrowser }
