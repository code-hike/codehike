import React from "react"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import {
  classNamesWithPrefix,
  Classes,
} from "@code-hike/utils"
import "./index.scss"

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
