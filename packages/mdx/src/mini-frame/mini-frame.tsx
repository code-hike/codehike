import React from "react"
import {
  ClasserProvider,
  useClasser,
  Classes,
} from "../classer"
import { EditorTheme, getColor, ColorName } from "../utils"

type MiniFrameProps = {
  title?: string
  titleBar?: React.ReactNode
  zoom?: number
  classes?: Classes
  overflow?: string
  theme: EditorTheme
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

export const MiniFrame = React.forwardRef<
  HTMLDivElement,
  MiniFrameProps
>(function (
  {
    title,
    children,
    titleBar,
    classes,
    theme,
    zoom = 1,
    overflow,
    ...props
  },
  ref
) {
  const c = useClasser("ch-frame", classes)

  const bar = titleBar || <DefaultTitleBar title={title} />
  const zoomStyle = {
    "--ch-frame-zoom": zoom,
    overflow,
  } as React.CSSProperties

  return (
    <ClasserProvider classes={classes}>
      <div {...props} ref={ref}>
        <div className={c("")}>
          <div
            className={c("title-bar")}
            style={{
              background: getColor(
                theme,
                ColorName.EditorGroupHeaderBackground
              ),
            }}
          >
            {bar}
          </div>
          <div className={c("content")}>
            <div className={c("zoom")} style={zoomStyle}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </ClasserProvider>
  )
})

export const SimpleFrame = React.forwardRef<
  HTMLDivElement,
  MiniFrameProps
>(function (
  {
    title,
    children,
    titleBar,
    classes,
    overflow,
    ...props
  },
  ref
) {
  const c = useClasser("ch", classes)

  const bar = titleBar || <DefaultTitleBar title={title} />
  return (
    <ClasserProvider classes={classes}>
      <div {...props} ref={ref}>
        <div className={c("simple-frame")}>
          <div className={c("frame-title-bar")}>{bar}</div>
          {children}
        </div>
      </div>
    </ClasserProvider>
  )
})

function DefaultTitleBar({ title }: { title?: string }) {
  const c = useClasser("ch-frame")
  return (
    <>
      <div className={c("left-bar")}>
        <FrameButtons />
      </div>
      <div className={c("middle-bar")}>{title}</div>
      <div className={c("right-bar")}></div>
    </>
  )
}

export function FrameButtons() {
  const c = useClasser("ch-frame")
  return (
    <div className={c("buttons")}>
      <div className={c("button", "button-left")} />
      <div className={c("button-space")} />
      <div className={c("button", "button-middle")} />
      <div className={c("button-space")} />
      <div className={c("button", "button-right")} />
    </div>
  )
}
