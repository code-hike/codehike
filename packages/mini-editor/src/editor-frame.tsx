import React from "react";
import { TerminalContent } from "@code-hike/mini-terminal";
import { MiniFrame, FrameButtons } from "@code-hike/mini-frame";
import "./editor-frame.css";

export { EditorFrame };

type EditorFrameProps = {
  files: string[];
  active: string;
  terminal?: string;
  terminalHeight?: number;
  progress: number;
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

function EditorFrame({
  files,
  active,
  terminal,
  terminalHeight,
  progress,
  children,
  ...rest
}: EditorFrameProps) {
  return (
    <MiniFrame
      titleBar={<TabsContainer files={files} active={active} />}
      {...rest}
    >
      <div className="ch-editor-body">{children}</div>
      <TerminalPanel
        code={terminal}
        height={terminalHeight}
        progress={progress}
      />
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

type TerminalPanelProps = { code?: string; height?: number; progress?: number };
function TerminalPanel({
  code = "",
  height,
  progress = 0,
}: TerminalPanelProps) {
  return !height ? null : (
    <div className="ch-editor-terminal" style={{ height }}>
      <div className="ch-editor-terminal-tab">
        <span>Terminal</span>
      </div>
      <div className="ch-editor-terminal-content">
        <TerminalContent text={code} progress={progress} />
      </div>
    </div>
  );
}
