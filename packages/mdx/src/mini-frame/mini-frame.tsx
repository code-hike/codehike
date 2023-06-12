import React from "react"

type MiniFrameProps = {
  title?: string
  titleBar?: React.ReactNode
  zoom?: number
  overflow?: string
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

export const MiniFrame = React.forwardRef<
  HTMLDivElement,
  MiniFrameProps
>(function (
  {
    title,
    children,
    titleBar,
    zoom = 1,
    overflow,
    ...props
  },
  ref
) {
  const bar = titleBar || <DefaultTitleBar title={title} />
  const zoomStyle = {
    "--ch-frame-zoom": zoom,
    overflow,
  } as React.CSSProperties

  return (
    <div {...props} ref={ref}>
      <div className="ch-frame">
        <div className="ch-frame-title-bar">{bar}</div>
        <div className={"ch-frame-content"}>
          <div
            className={"ch-frame-zoom"}
            style={zoomStyle}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
})

export const SimpleFrame = React.forwardRef<
  HTMLDivElement,
  MiniFrameProps
>(function (
  { title, children, titleBar, overflow, ...props },
  ref
) {
  const bar = titleBar || <DefaultTitleBar title={title} />
  return (
    <div {...props} ref={ref}>
      <div className="ch-simple-frame">
        <div className="ch-frame-title-bar">{bar}</div>
        {children}
      </div>
    </div>
  )
})

function DefaultTitleBar({ title }: { title?: string }) {
  return (
    <>
      <div className="ch-frame-left-bar">
        <FrameButtons />
      </div>
      <div className="ch-frame-middle-bar">{title}</div>
      <div className="ch-frame-right-bar" />
    </>
  )
}

export function FrameButtons() {
  return (
    <div className="ch-frame-buttons">
      <div className="ch-frame-button ch-frame-button-left" />
      <div className="ch-frame-button-space" />
      <div className="ch-frame-button ch-frame-button-middle" />
      <div className="ch-frame-button-space" />
      <div className="ch-frame-button ch-frame-button-right" />
    </div>
  )
}
