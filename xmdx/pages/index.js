import React from "react";
import s from "./index.module.css";
import { MiniEditor } from "@code-hike/mini-editor";
import { MiniBrowser } from "@code-hike/mini-browser";
import { Range, getTrackBackground } from "react-range";
import { Video, useTimeData } from "@code-hike/player";
import { useSpring } from "use-spring";

const code = require("!!raw-loader!./content/scroller.mdx")
  .default;

const videoSteps = [
  { src: "000.mp4", start: 0, end: 5 },
  { src: "000.mp4", start: 1, end: 3 },
  { src: "000.mp4", start: 1, end: 6 },
  { src: "000.mp4", start: 0, end: 7 },
  { src: "000.mp4", start: 0, end: 7 },
  { src: "000.mp4", start: 0, end: 7 },
  { src: "000.mp4", start: 0, end: 7 },
  { src: "000.mp4", start: 0, end: 7 },
];

const codeSteps = [
  { focus: "10:20" },
  { focus: "20:30" },
  { focus: "10:20" },
  { focus: "20:30" },
  { focus: "10:20" },
  { focus: "20:30" },
  { focus: "10:20" },
  { focus: "20:30" },
];

export default function Page() {
  const [stepIndex, changeStep] = React.useState(0);
  const [videoTime, setVideoTime] = React.useState(
    videoSteps[0].start
  );
  const [progress] = useSpring(stepIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  });
  return (
    <div className={s.page}>
      <style global jsx>{`
        html,
        body,
        div#__next {
          height: 100%;
          margin: 0;
        }
      `}</style>
      <main className={s.main}>
        <div className={s.grid}>
          <div className={s.div1}>
            <MiniEditor
              style={{ height: "100%" }}
              file="cake.mdx"
              lang="md"
              code={code}
              steps={codeSteps}
              progress={progress}
            />
          </div>
          <div className={s.div2}>
            <MiniBrowser
              style={{ height: "100%" }}
              zoom={0.4}
              url="http://localhost:3000/scroller"
            />
          </div>
          <div className={s.div3}>
            <Author
              onStepChange={changeStep}
              onTimeChange={setVideoTime}
            />
          </div>
        </div>
        <VideoControls
          steps={videoSteps}
          videoTime={videoTime}
          stepIndex={stepIndex}
        />
      </main>
    </div>
  );
}

function Author({ onStepChange, onTimeChange }) {
  return (
    <div className={s.video}>
      <div
        style={{
          height: "100%",
          float: "right",
          marginRight: -30,
        }}
      >
        <Video
          steps={videoSteps}
          style={{
            height: "100%",
          }}
          muted
          onStepChange={onStepChange}
          onTimeChange={onTimeChange}
        />
      </div>
      <div
        className={s.details}
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div>
          <span style={{ fontSize: "1.2em" }}>@pomber</span>
          <div style={{ height: 5 }} />
          <span style={{ fontSize: "1.8em" }}>Rodrigo</span>
          <br />
          <span style={{ fontSize: "2em" }}>Pombo</span>
          <div style={{ height: 10 }} />
          <span style={{ fontSize: "1.3em" }}>
            FOO CONF
          </span>
        </div>
      </div>
    </div>
  );
}

function VideoControls({ steps, stepIndex, videoTime }) {
  // const [value, setValue] = React.useState(10);
  const { currentSeconds, totalSeconds } = useTimeData({
    steps,
    stepIndex,
    videoTime,
  });

  const value = currentSeconds;
  return (
    <Range
      step={0.1}
      min={0}
      max={totalSeconds}
      values={[value]}
      // onChange={(values) => setValue(values[0])}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "5px",
            width: "100%",
            background: getTrackBackground({
              values: [value],
              colors: ["red", "#ccc"],
              min: 0,
              max: totalSeconds,
            }),
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "12px",
            width: "12px",
            borderRadius: "50%",
            backgroundColor: "red",
          }}
        />
      )}
    />
  );
}
