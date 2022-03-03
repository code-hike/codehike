import React from "react"
import { Page } from "./utils"
import { Video, Controls } from "@code-hike/player"
import videoSrc from "./assets/timer.mp4"

export default {
  title: "Test/Player",
}

const src = videoSrc
// const src =
//   "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";
// const duration = 596.504

const steps = [
  { src: src, start: 3, end: 5 },
  { src: src, start: 5, end: 10 },
  { src: src, start: 15, end: 20 },
  { src: src, start: 25, end: 60 },
]
export const basic = () => {
  const ref = React.useRef()
  const [currentStepIndex, setStepIndex] = React.useState(0)
  const [currentTime, setTime] = React.useState(0)

  return (
    <Page
      style={{
        width: 600,
        maxWidth: 600,
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
      }}
    >
      <Video
        ref={ref}
        steps={steps}
        style={{ height: 200 }}
        onStepChange={setStepIndex}
        onTimeChange={(time, prevTime) => setTime(time)}
      />
      <div style={{ width: 300 }}>
        <div>
          <button onClick={() => ref.current.play()}>
            Play
          </button>
          <button onClick={() => ref.current.pause()}>
            Pause
          </button>
          <button
            onClick={() =>
              ref.current.seek(0, steps[0].start)
            }
          >
            Reset
          </button>
        </div>
        <div>Time: {currentTime}</div>
        <ul>
          {steps.map(({ start, end }, i) => (
            <li
              key={i}
              style={{
                opacity:
                  i === currentStepIndex ? 0.99 : 0.5,
              }}
            >
              {start} - {end}
            </li>
          ))}
        </ul>
      </div>
    </Page>
  )
}

export const video = () => {
  const [state, setState] = React.useState({
    stepIndex: 0,
    videoTime: steps[0].start,
  })
  const ref = React.useRef()
  return (
    <Page style={{ width: 300 }}>
      <Video
        ref={ref}
        steps={steps}
        onTimeChange={t =>
          setState(s => ({ ...s, videoTime: t }))
        }
        onStepChange={i =>
          setState(s => ({ ...s, stepIndex: i }))
        }
        style={{ height: 200 }}
      />
      <Controls
        steps={steps}
        stepIndex={state.stepIndex}
        videoTime={state.videoTime}
        onChange={({ stepIndex, videoTime }) => {
          ref.current.seek(stepIndex, videoTime)
        }}
      />
    </Page>
  )
}
