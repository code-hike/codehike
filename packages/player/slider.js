import React from "react";
import { Range, Direction, getTrackBackground } from "react-range";

export { Slider };

function Slider({ inputSteps, currentIndex, stepProgress, onChange, style }) {
  const { steps, totalDuration } = React.useMemo(() => {
    let totalDuration = 0;
    let steps = [];
    inputSteps.forEach((step) => {
      steps.push({
        start: totalDuration,
        duration: step.duration,
        end: totalDuration + step.duration,
      });
      totalDuration += step.duration;
    });
    return { steps, totalDuration };
  }, inputSteps);
  const currentStep = steps[currentIndex];
  const progress = currentStep.start + stepProgress;
  return (
    <div style={{ display: "flex", color: "#7387c4", ...style }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <RangeBar
          style={style}
          max={totalDuration}
          value={progress}
          ticks={steps.map((s) => s.start)}
          onChange={(value) => onChange(getStepProgressFromValue(steps, value))}
        />
        {/* {isPlaying ? (
        <button onClick={pause}>Pause</button>
      ) : (
        <button onClick={play}>Play</button>
      )} */}
      </div>
      <div style={{ width: 16 }} />
      <div>
        {secondsToTime(progress)} / {secondsToTime(totalDuration)}
      </div>
    </div>
  );
}

function getStepProgressFromValue(steps, value) {
  let i = 0;
  for (; i < steps.length - 1; i++) {
    if (value < steps[i].end) break;
  }
  return { stepIndex: i, stepProgress: value - steps[i].start };
}

function RangeBar({ max, value, onChange, ticks, style }) {
  return (
    <Range
      direction={Direction.Right}
      values={[value]}
      step={1}
      min={0}
      max={max}
      onChange={(values) => onChange(values[0])}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: 20,
            // border: "1px solid salmon",
            // height: "32px",
            display: "flex",
            // flexDirection: "column",
            margin: "6px 0",
            // width: "100%",
            // margin: "0 10px",
            position: "relative",
            alignItems: "center",
            flex: 1,
          }}
        >
          {/* <div style={{ position: "absolute", width: "100%" }}>
            {ticks.map((x) => (
              <div
                key={x}
                style={{
                  width: 10,
                  height: 10,
                  position: "absolute",
                  left: `${(100 * x) / max}%`,
                  background: value < x ? "#333" : "#7387c4",
                  borderRadius: "50%",
                  transform: `translate(-50%,-50%)`,
                }}
              />
            ))}
          </div> */}
          <div
            ref={props.ref}
            style={{
              height: "4px",
              width: "100%",
              borderRadius: "4px",

              background: getTrackBackground({
                values: [value],
                colors: ["#7387c4", "#333"],
                min: 0,
                max: max,
                direction: Direction.Right,
              }),
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => (
        <div
          {...props}
          style={{
            ...props.style,
            width: "10px",
            height: "6px",
            // borderRadius: "50%",
            // border: `${isDragged ? 2 : 0}px solid #4f4f4f`,
            // backgroundColor: "#fafafa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // opacity: 0.5,
            boxSizing: "border-box",
          }}
        >
          <style jsx>{`
            div:focus {
              background: #7387c488;
            }
          `}</style>
        </div>
      )}
    />
  );
}

function secondsToTime(seconds) {
  const s = Math.max(Math.round(seconds % 60), 0)
    .toString()
    .padStart(2, 0);
  const m = Math.max(Math.round(seconds / 60), 0);
  return `${m}:${s}`;
}
