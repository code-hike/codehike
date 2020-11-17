import React from "react";

export function Page({ children, style }) {
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        maxWidth: "500px",
        margin: "0 auto",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function WithProgress({ children, length = 2 }) {
  const [{ progress, backward }, setState] = React.useState({
    progress: 0,
    backward: false,
  });
  return (
    <Page>
      <div style={{ display: "flex", margin: "10px 0" }}>
        <input
          style={{ flex: "1" }}
          type="range"
          value={progress}
          max={length - 1}
          step={0.01}
          onChange={(e) => {
            const newProgress = +e.target.value;
            setState((oldState) => ({
              progress: newProgress,
              backward: oldState.progress > newProgress,
            }));
          }}
        />
        <span style={{ width: 40, textAlign: "right" }}>
          {progress.toFixed(2)}
        </span>
      </div>
      {children(progress, backward)}
    </Page>
  );
}
