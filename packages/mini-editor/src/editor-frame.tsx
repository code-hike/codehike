import React from "react"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import { Classes, useClasser } from "@code-hike/classer"
import "./index.scss"

export { EditorFrame, TerminalPanel }

const DEFAULT_HEIGHT = 200

type EditorFrameProps = {
  files: string[]
  active: string
  height?: number
  terminalPanel: React.ReactNode
  button?: React.ReactNode
  classes?: Classes
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
  const c = useClasser("ch-editor")
  return (
    <MiniFrame
      titleBar={
        <TabsContainer
          files={files}
          active={active}
          button={button}
        />
      }
      classes={classes}
      style={{ height: height ?? DEFAULT_HEIGHT, ...style }}
      {...rest}
    >
      <div className={c("body")}>{children}</div>
      {terminalPanel}
    </MiniFrame>
  )
}

type TabsContainerProps = {
  files: string[]
  active: string
  button?: React.ReactNode
}
function TabsContainer({
  files,
  active,
  button,
}: TabsContainerProps) {
  const c = useClasser("ch-editor-tab")
  return (
    <>
      <FrameButtons />
      {files.map(fileName => (
        <div
          key={fileName}
          title={fileName}
          className={c(
            "",
            fileName === active ? "active" : "inactive"
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
