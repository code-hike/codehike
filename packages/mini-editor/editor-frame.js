import React from "react";

export { EditorFrame };

function EditorFrame({ children, files, active, height, link, style }) {
  return (
    <div
      className="shadow"
      style={{
        height,
        position: "relative",
        borderRadius: "6px",
        // border: "1px solid rgba(175, 173, 169, 0.15)",
        boxShadow:
          "0 13px 27px -5px rgba(50,50,93,.25), 0 8px 16px -8px rgba(0,0,0,.3), 0 -6px 16px -6px rgba(0,0,0,.025)",
        overflow: "hidden",
        fontFamily:
          "Ubuntu,Droid Sans,-apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,sans-serif",
        ...style,
      }}
    >
      <TabsContainer files={files} active={active} link={link} />
      <EditorContainer>{children}</EditorContainer>
    </div>
  );
}

function Button({ bg, border }) {
  return (
    <div
      style={{
        background: bg,
        width: "10px",
        height: "10px",
        border: `1px solid ${border}`,
        borderRadius: "50%",
        display: "inline-block",
        marginLeft: "6px",
      }}
    />
  );
}

function Buttons() {
  return (
    <div
      style={{
        margin: "auto 10px auto 4px",
      }}
    >
      <Button border="#e33e41" bg="#ff5c5c" />
      <Button border="#e09e3e" bg="#ffbd4c" />
      <Button border="#14ae46" bg="#00ca56" />
    </div>
  );
}

function Tab({ enabled, children }) {
  return (
    <div
      style={{
        borderRight: "1px solid rgb(37, 37, 38)",
        background: enabled ? "rgb(30, 30, 30)" : "rgb(45, 45, 45)",
        width: "120px",
        minWidth: "fit-content",
        flexShrink: "0",
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

function TabsContainer({ files, active, link }) {
  return (
    <div
      style={{
        height: "28px",
        background: "rgb(37, 37, 38)",
        overflow: "hidden",
        display: "flex",
      }}
    >
      <Buttons />
      {files.map((fileName) => (
        <Tab key={fileName} enabled={fileName === active}>
          {fileName}
        </Tab>
      ))}
      <div style={{ flex: 1 }} />
    </div>
  );
}

const editorStyle = {
  backgroundColor: "rgb(30, 30, 30)",
  height: "calc(100% - 28px)",
  color: "#cccccc",
  fontSize: "15px",
  padding: "5px 10px",
  lineHeight: "1.1rem",
};
function EditorContainer({ children }) {
  return <div style={editorStyle}>{children}</div>;
}
