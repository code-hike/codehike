import React from "react"
import { Global, css } from "@emotion/react"
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
      <Styles />
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

function Styles() {
  return (
    <Global
      styles={css`
        .ch-frame {
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
            0 8px 16px -8px rgba(0, 0, 0, 0.3),
            0 -6px 16px -6px rgba(0, 0, 0, 0.025);
          font-family: Ubuntu, Droid Sans, -apple-system,
            BlinkMacSystemFont, Segoe WPC, Segoe UI,
            sans-serif;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: rgb(37, 37, 38);
        }

        .ch-frame-content {
          background-color: #fafafa;
          flex-grow: 1;
          flex-shrink: 1;
          flex-basis: 0;
          min-height: 0;
        }

        .ch-frame-zoom {
          --ch-frame-zoom: 1;
          overflow: auto;
          position: relative;
          width: calc(100% / var(--ch-frame-zoom));
          height: calc(100% / var(--ch-frame-zoom));
          transform: scale(var(--ch-frame-zoom));
          transform-origin: left top;
        }

        .ch-frame-title-bar {
          font-size: 12px;
          width: 100%;
          height: 2.5em;
          min-height: 2.5em;
          flex-grow: 0;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          background-color: rgb(37, 37, 38);
          color: #ebebed;
        }

        .ch-frame-middle-bar {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 1.2em;
        }

        .ch-frame-left-bar,
        .ch-frame-right-bar {
          flex-grow: 1;
          flex-basis: 1em;
          height: 100%;
          display: flex;
          align-items: center;
          width: max-content;
        }

        .ch-frame-buttons {
          margin: 0 0.8em;
          flex-shrink: 0;
          height: 1em;
          width: 4.16em;
          display: flex;
        }

        .ch-frame-button {
          width: 1em;
          height: 1em;
          border: 0.08em solid;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
        }

        .ch-frame-button-space {
          width: 0.56em;
        }

        .ch-frame-button-left {
          border-color: #ce5347;
          background-color: #ed6b60;
        }

        .ch-frame-button-middle {
          border-color: #d6a243;
          background-color: #f5be4f;
        }

        .ch-frame-button-right {
          border-color: #58a942;
          background-color: #62c554;
        }
      `}
    />
  )
}
