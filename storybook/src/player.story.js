import React from "react";
import { Page } from "./utils";
import { Video, Controls } from "@code-hike/player";

export default {
  title: "Player",
};

const src =
  "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";
const duration = 596.504;

const steps = [
  { src: src, start: 25, end: 30 },
  { src: src, start: 50, end: 55 },
  { src: src, start: 200, end: 225 },
];

export const video = () => {
  const [state, setState] = React.useState({
    stepIndex: 0,
    videoTime: steps[0].start,
  });
  const ref = React.useRef();
  return (
    <Page style={{ width: 300 }}>
      <Video
        ref={ref}
        steps={steps}
        onTimeChange={(t) =>
          setState((s) => ({ ...s, videoTime: t }))
        }
        onStepChange={(i) =>
          setState((s) => ({ ...s, stepIndex: i }))
        }
        style={{ height: 200 }}
      />
      <Controls
        steps={steps}
        stepIndex={state.stepIndex}
        videoTime={state.videoTime}
        onChange={({ stepIndex, videoTime }) => {
          ref.current.seek(stepIndex, videoTime);
        }}
      />
    </Page>
  );
};
