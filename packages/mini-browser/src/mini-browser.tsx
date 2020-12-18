import React from "react"
import { Back, Forward, Open } from "./buttons"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import { Classes } from "@code-hike/utils"
import { Global, css } from "@emotion/react"

type MiniBrowserStep = {
  url?: string
  loadUrl?: string
  children?: React.ReactNode
  zoom?: number
  prependOrigin?: boolean
}

type MiniBrowserProps = {
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

const MiniBrowser = React.forwardRef<
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
        <Bar
          url={currentStep.url!}
          linkUrl={currentStep.loadUrl!}
          classes={classes}
        />
      }
    >
      <Styles />
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
  classes,
}: {
  url: string
  linkUrl: string
  classes: Classes
}) {
  return (
    <>
      <FrameButtons classes={classes} />
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

function Styles() {
  return (
    <Global
      styles={css`
        .ch-mini-browser {
          height: 100%;
        }

        .ch-mini-browser .ch-frame-content iframe,
        .ch-mini-browser .ch-frame-content video {
          border: none;
          position: absolute;
          height: 100%;
          width: 100%;
        }

        .ch-mini-browser .ch-frame-title-bar input {
          height: 1.4em;
          font-size: 1em;
          border-radius: 0.5em;
          border: none;
          box-shadow: none;
          flex: 1;
          padding: 0 10px;
          color: #544;
        }
      `}
    />
  )
}
