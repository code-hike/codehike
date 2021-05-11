import React from "react"

export function Page({ children, style, ...rest }) {
  return (
    <div
      {...rest}
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
  )
}

export function WithProgress({
  children,
  length = 2,
  start = 0,
  ...rest
}) {
  const [{ progress, backward }, setState] = React.useState(
    {
      progress: start,
      backward: false,
    }
  )

  return (
    <Page {...rest}>
      <div style={{ display: "flex", margin: "10px 0" }}>
        <button
          onClick={() => {
            const newProgress =
              Math.floor(progress) === progress
                ? progress - 1
                : Math.floor(progress)
            setState(oldState => ({
              progress: newProgress,
              backward: oldState.progress > newProgress,
            }))
          }}
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            const newProgress =
              Math.ceil(progress) === progress
                ? progress + 1
                : Math.ceil(progress)
            setState(oldState => ({
              progress: newProgress,
              backward: oldState.progress > newProgress,
            }))
          }}
        >
          {">"}
        </button>
        <input
          style={{ flex: "1" }}
          type="range"
          value={progress}
          max={length - 1}
          step={0.01}
          onChange={e => {
            const newProgress = +e.target.value
            setState(oldState => ({
              progress: newProgress,
              backward: oldState.progress > newProgress,
            }))
          }}
        />
        <span style={{ width: 40, textAlign: "right" }}>
          {progress.toFixed(2)}
        </span>
      </div>
      {children(progress, backward)}
    </Page>
  )
}
