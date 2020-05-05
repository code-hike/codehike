import React from "react";
import { useSpring } from "use-spring";
export { StepsRange, useStepsProgress };

function useStepsProgress() {
  const [{ target, teleport }, setState] = React.useState({
    target: 0,
    teleport: false,
  });
  const [progress] = useSpring(target, { teleport });

  return [progress, setState];
}

function StepsRange({ progress, updateProgress: setState, stepsCount }) {
  const max = stepsCount - 1;
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "24px" }}>
      <button
        style={{ userSelect: "none" }}
        onClick={() =>
          setState(({ target }) => ({
            teleport: false,
            target: Math.max(Math.ceil(target - 1), 0),
          }))
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
          setState(({ target }) => ({
            teleport: false,
            target: Math.min(Math.floor(target + 1), max),
          }))
        }
      >
        next
      </button>
    </div>
  );
}
