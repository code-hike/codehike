import React from "react"
import { useSpring } from "use-spring"

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
  const [{ target, backward }, setState] = React.useState({
    target: start,
    backward: false,
  })

  const [progress] = useSpring(target)

  return (
    <Page {...rest}>
      <div style={{ display: "flex", margin: "10px 0" }}>
        <button
          onClick={() => {
            const newTarget =
              Math.floor(target) === target
                ? target - 1
                : Math.floor(target)
            setState({
              target: newTarget,
              backward: progress > newTarget,
            })
          }}
        >
          {"<"}
        </button>
        <button
          onClick={() => {
            const newTarget =
              Math.ceil(target) === target
                ? target + 1
                : Math.ceil(target)
            setState({
              target: newTarget,
              backward: progress > newTarget,
            })
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
            const newTarget = +e.target.value
            setState({
              target: newTarget,
              backward: progress > newTarget,
            })
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
