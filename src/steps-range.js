import React from "react";
import { useSpring } from "use-spring";
export { StepsRange };

function StepsRange({ max, onChange }) {
  const [{ target, teleport }, setState] = React.useState({
    target: 0,
    teleport: false,
  });
  const [progress] = useSpring(target, { teleport });

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
      <button
        style={{ userSelect: "none" }}
        onClick={() =>
          setState((p) =>
            setState({ teleport: false, target: Math.max(Math.ceil(p - 1), 0) })
          )
        }
      >
        prev
      </button>
      <input
        type="range"
        max={max}
        step={0.01}
        style={{ width: "100%" }}
        onChange={(e) => setState({ target: +e.target.value, teleport: true })}
        value={progress}
      />
      <button
        style={{ userSelect: "none" }}
        onClick={() =>
          setState((p) =>
            setState({
              teleport: false,
              target: Math.min(Math.floor(p + 1), max),
            })
          )
        }
      >
        next
      </button>
    </div>
  );
}
