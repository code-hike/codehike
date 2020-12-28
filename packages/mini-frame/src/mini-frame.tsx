import React from "react"
import {
  classNamesWithPrefix,
  Classes,
} from "@code-hike/utils"

const c = classNamesWithPrefix("ch-frame")

type MiniFrameProps = {
  title?: string
  titleBar?: React.ReactNode
  zoom?: number
  classes?: Classes
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

export function MiniFrame({
  title,
  children,
  titleBar,
  classes = {},
  zoom = 1,
  ...props
}: MiniFrameProps) {
  const bar = titleBar || (
    <DefaultTitleBar title={title} classes={classes} />
  )
  return (
    <div {...props}>
      <div className={c("", classes)}>
        <div className={c("-title-bar", classes)}>
          {bar}
        </div>
        <div className={c("-content", classes)}>
          <div
            className={c("-zoom", classes)}
            style={
              {
                "--ch-frame-zoom": zoom,
              } as React.CSSProperties
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function DefaultTitleBar({
  title,
  classes,
}: {
  title?: string
  classes: Classes
}) {
  return (
    <>
      <div className={c("-left-bar", classes)}>
        <FrameButtons classes={classes} />
      </div>
      <div className={c("-middle-bar", classes)}>
        {title}
      </div>
      <div className={c("-right-bar", classes)}></div>
    </>
  )
}

export function FrameButtons({
  classes = {},
}: {
  classes: Classes | undefined
}) {
  return (
    <div className={c("-buttons", classes)}>
      <div
        className={c(["-button", "-button-left"], classes)}
      />
      <div className={c("-button-space", classes)} />
      <div
        className={c(
          ["-button", "-button-middle"],
          classes
        )}
      />
      <div className={c("-button-space", classes)} />
      <div
        className={c(["-button", "-button-right"], classes)}
      />
    </div>
  )
}
