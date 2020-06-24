import React from "react";
import { TerminalContent } from "@code-hike/mini-terminal";
import { MiniFrame, FrameButtons } from "@code-hike/mini-frame";

export { EditorFrame };

function EditorFrame({
  children,
  files,
  active,
  terminal,
  terminalHeight,
  height,
  link,
  style,
  progress,
}: any) {
  return (
    <MiniFrame
      style={{ height, ...style }}
      titleBar={<TabsContainer files={files} active={active} link={link} />}
    >
      <EditorContainer>{children}</EditorContainer>
      <TerminalPanel
        code={terminal}
        height={terminalHeight}
        progress={progress}
      />
    </MiniFrame>
  );
}

function Tab({ enabled, children }: any) {
  return (
    <div
      style={{
        borderRight: "1px solid rgb(37, 37, 38)",
        background: enabled ? "rgb(30, 30, 30)" : "rgb(45, 45, 45)",
        width: "120px",
        minWidth: "fit-content",
        flexShrink: 0,
        position: "relative",
        display: "flex",
        whiteSpace: "nowrap",
        cursor: "pointer",
        height: "28px",
        boxSizing: "border-box",
        paddingLeft: "15px",
        paddingRight: "15px",
        color: enabled ? "rgba(255, 255, 255)" : "rgba(255, 255, 255, 0.5)",
      }}
    >
      <div
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          fontSize: "12px",
          lineHeight: "1.4em",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function TabsContainer({ files, active }: any) {
  return (
    <>
      <FrameButtons />
      {files.map((fileName: string) => (
        <Tab key={fileName} enabled={fileName === active}>
          {fileName}
        </Tab>
      ))}
      <div style={{ flex: 1 }} />
    </>
  );
}

const editorStyle = {
  backgroundColor: "rgb(30, 30, 30)",
  height: "100%",
  color: "#cccccc",
  fontSize: "15px",
  padding: "5px 10px",
  lineHeight: "1.1rem",
};
function EditorContainer({ children }: any) {
  return (
    <div style={editorStyle} className="ch-editor-content">
      {children}
    </div>
  );
}

function TerminalPanel({ code, height, progress }: any) {
  return !height ? null : (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        height,
        width: "100%",
        background: "rgb(30, 30, 30)",
        color: "rgb(231, 231, 231)",
        borderTop: "1px solid rgba(128, 128, 128, 0.35)",
        padding: "0 8px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          textTransform: "uppercase",
          padding: "4px 10px 3px",
          fontSize: "11px",
          lineHeight: "24px",
          display: "flex",
        }}
      >
        <span style={{ borderBottom: "1px solid rgb(231, 231, 231)" }}>
          Terminal
        </span>
      </div>
      <div
        style={{
          marginTop: "8px",
          height: "calc(100% - 40px)",
          boxSizing: "border-box",
          fontSize: "12px",
        }}
      >
        <TerminalContent text={code} progress={progress} />
      </div>
    </div>
  );
}
