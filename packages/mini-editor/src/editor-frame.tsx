import React from "react";
import { MiniFrame, FrameButtons } from "@code-hike/mini-frame";
import "./editor-frame.css";

export { EditorFrame, TerminalPanel };

type EditorFrameProps = {
  files: string[];
  active: string;
  terminalPanel: React.ReactNode;
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

function EditorFrame({
  files,
  active,
  children,
  terminalPanel,
  ...rest
}: EditorFrameProps) {
  return (
    <MiniFrame
      titleBar={<TabsContainer files={files} active={active} />}
      {...rest}
    >
      <div className="ch-editor-body">{children}</div>
      {terminalPanel}
    </MiniFrame>
  );
}

type TabsContainerProps = {
  files: string[];
  active: string;
};
function TabsContainer({ files, active }: TabsContainerProps) {
  return (
    <>
      <FrameButtons />
      {files.map((fileName) => (
        <div
          key={fileName}
          className="ch-editor-tab"
          data-active={fileName === active || undefined}
        >
          <div>{fileName}</div>
        </div>
      ))}
      <div style={{ flex: 1 }} />
    </>
  );
}

type TerminalPanelProps = { height?: number; children: React.ReactNode };
function TerminalPanel({ height, children }: TerminalPanelProps) {
  return !height ? null : (
    <div className="ch-editor-terminal" style={{ height }}>
      <div className="ch-editor-terminal-tab">
        <span>Terminal</span>
      </div>
      <div className="ch-editor-terminal-content">{children}</div>
    </div>
  );
}
