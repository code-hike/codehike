import React from "react"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import "./editor-frame.css"

export { EditorFrame, TerminalPanel }

const DEFAULT_HEIGHT = 200

type EditorFrameProps = {
  files: string[]
  active: string
  height?: number
  terminalPanel: React.ReactNode
  button?: React.ReactNode
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>

function EditorFrame({
  files,
  active,
  children,
  terminalPanel,
  height,
  style,
  button,
  ...rest
}: EditorFrameProps) {
  return (
    <MiniFrame
      titleBar={
        <TabsContainer
          files={files}
          active={active}
          button={button}
        />
      }
      style={{ height: height ?? DEFAULT_HEIGHT, ...style }}
      {...rest}
    >
      <div className="ch-editor-body">{children}</div>
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
  return (
    <>
      <FrameButtons />
      {files.map(fileName => (
        <div
          key={fileName}
          className="ch-editor-tab"
          data-active={fileName === active || undefined}
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
