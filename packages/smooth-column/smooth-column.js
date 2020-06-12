import React from "react";
import { useFrame } from "./use-frame";

export { SmoothColumn };

function SmoothColumn({ steps, progress, backwards }) {
  const views = steps;
  const prevKids = views[Math.floor(progress)];
  const nextKids = views[Math.floor(progress) + 1] || prevKids;
  const padding = 40;
  const { frame, height } = useFrame(prevKids, nextKids, progress % 1, padding);
  return (
    <div style={{ height }}>
      {frame.map(({ child, translateY, opacity }, i) => (
        <div
          style={{
            position: "absolute",
            top: "50%",
            width: "100%",
            transform: `translateY(${translateY}px)`,
            opacity: opacity,
          }}
        >
          {React.cloneElement(child, { progress, backwards })}
        </div>
      ))}
    </div>
  );
}
