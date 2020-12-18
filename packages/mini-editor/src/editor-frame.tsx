import React from "react"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import {
  classNamesWithPrefix,
  Classes,
} from "@code-hike/utils"
import { Global, css } from "@emotion/react"

const c = classNamesWithPrefix("ch-editor")

export { EditorFrame, TerminalPanel }

const DEFAULT_HEIGHT = 200

type EditorFrameProps = {
  files: string[]
  active: string
  height?: number
  terminalPanel: React.ReactNode
  button?: React.ReactNode
  classes: Record<string, string>
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

function EditorFrame({
  files,
  active,
  children,
  terminalPanel,
  height,
  style,
  button,
  classes,
  ...rest
}: EditorFrameProps) {
  return (
    <MiniFrame
      titleBar={
        <TabsContainer
          files={files}
          active={active}
          button={button}
          classes={classes}
        />
      }
      classes={classes}
      style={{ height: height ?? DEFAULT_HEIGHT, ...style }}
      {...rest}
    >
      <Styles />
      <div className={c("-body", classes)}>{children}</div>
      {terminalPanel}
    </MiniFrame>
  )
}

type TabsContainerProps = {
  files: string[]
  active: string
  button?: React.ReactNode
  classes?: Classes
}
function TabsContainer({
  files,
  active,
  button,
  classes,
}: TabsContainerProps) {
  return (
    <>
      <FrameButtons classes={classes} />
      {files.map(fileName => (
        <div
          key={fileName}
          className={c(
            [
              "-tab",
              fileName === active
                ? "-tab-active"
                : "-tab-inactive",
            ],
            classes
          )}
        >
          <div>{fileName}</div>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      {button}
    </>
  )
}

type TerminalPanelProps = {
  height?: number
  children: React.ReactNode
}
function TerminalPanel({
  height,
  children,
}: TerminalPanelProps) {
  return !height ? null : (
    <div className="ch-editor-terminal" style={{ height }}>
      <div className="ch-editor-terminal-tab">
        <span>Terminal</span>
      </div>
      <div className="ch-editor-terminal-content">
        {children}
      </div>
    </div>
  )
}

function Styles() {
  return (
    <Global
      styles={css`
        /** tabs */

        .ch-editor-tab {
          border-right: 1px solid rgb(37, 37, 38);
          width: 120px;
          min-width: fit-content;
          flex-shrink: 0;
          position: relative;
          display: flex;
          white-space: nowrap;
          cursor: pointer;
          height: 100%;
          box-sizing: border-box;
          padding-left: 15px;
          padding-right: 15px;
          background-color: rgb(45, 45, 45);
          color: rgba(255, 255, 255, 0.5);
        }

        .ch-editor-tab-active {
          background-color: rgb(30, 30, 30);
          color: rgba(255, 255, 255);
        }

        .ch-editor-tab > div {
          margin-top: auto;
          margin-bottom: auto;
          font-size: 12px;
          line-height: 1.4em;
          text-overflow: ellipsis;
        }

        /** body */

        .ch-editor-body {
          background-color: rgb(30, 30, 30);
          height: 100%;
          color: #cccccc;
          font-size: 15px;
          padding: 5px 10px;
          line-height: 1.1rem;
          box-sizing: border-box;
        }

        .ch-editor-body code {
          line-height: 20px;
        }

        /** terminal */

        .ch-editor-terminal {
          position: absolute;
          overflow: hidden;
          bottom: 0;
          width: 100%;
          background-color: rgb(30, 30, 30);
          color: rgb(231, 231, 231);
          border-top: 1px solid rgba(128, 128, 128, 0.35);
          padding: 0 8px;
          box-sizing: border-box;
        }

        .ch-editor-terminal-tab {
          text-transform: uppercase;
          padding: 4px 10px 3px;
          font-size: 11px;
          line-height: 24px;
          display: flex;
        }

        .ch-editor-terminal-tab > span {
          border-bottom: 1px solid rgb(231, 231, 231);
        }

        .ch-editor-terminal-content {
          margin-top: 8px;
          height: calc(100% -40px);
          box-sizing: border-box;
        }

        .ch-editor-terminal-content .ch-terminal {
          font-size: 12px;
          margin: 0;
        }
      `}
    />
  )
}
