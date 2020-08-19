import React from "react"
import s from "./cake.module.css"
import { MiniEditor } from "@code-hike/mini-editor"
import { MiniBrowser } from "@code-hike/mini-browser"
import { Range, getTrackBackground } from "react-range"
import { useTimeData } from "@code-hike/player"
import { useSpring } from "use-spring"
import { sim } from "@code-hike/sim-user"
import { SpeakerPanel } from "./speaker"

export function CakeLayout({
  videoSteps,
  browserSteps,
  editorSteps,
  captionSteps,
}) {
  const [stepIndex, changeStep] = React.useState(0)
  const playerRef = React.useRef()
  const browserRef = React.useRef()
  const [videoTime, setVideoTime] = React.useState(
    videoSteps[0].start
  )
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress] = useSpring(stepIndex, {
    decimals: 3,
    stiffness: 80,
    damping: 48,
    mass: 8,
  })
  const backward = stepIndex < progress

  const { currentSeconds, totalSeconds } = useTimeData({
    steps: videoSteps,
    stepIndex,
    videoTime,
  })

  const caption = useCaption(
    captionSteps,
    stepIndex,
    videoTime
  )

  const seek = ({ stepIndex, videoTime }) => {
    playerRef.current.seek(stepIndex, videoTime)
  }
  const play = () => {
    playerRef.current.play()
    setIsPlaying(true)
  }
  const pause = () => {
    playerRef.current.pause()
    setIsPlaying(false)
  }

  const onTimeChange = (newTime, oldTime) => {
    // currentStep.actions
    const browserStep = browserSteps[stepIndex]
    const actions = browserStep.actions || []
    const action = actions.find(
      a => oldTime < a.on && a.on <= newTime
    )

    if (action) {
      const document =
        browserRef.current.contentWindow.document
      sim(action, document)
    }

    setVideoTime(newTime)
  }

  return (
    <div className={s.page}>
      <style global jsx>{`
        html,
        body,
        div#__next {
          height: 100%;
          margin: 0;
        }
        .ch-frame .ch-editor-body {
          padding: 0;
        }
      `}</style>
      <main className={s.main}>
        <div className={s.grid}>
          <div className={s.div1}>
            <MiniEditor
              style={{ height: "100%" }}
              steps={editorSteps}
              progress={progress}
              backward={backward}
            />
          </div>
          <div className={s.div2}>
            <MiniBrowser
              style={{ height: "100%" }}
              steps={browserSteps}
              progress={progress}
              backward={backward}
              prependOrigin={true}
              ref={browserRef}
            />
          </div>
          <div className={s.div3}>
            <SpeakerPanel
              ref={playerRef}
              videoSteps={videoSteps}
              changeStep={changeStep}
              onTimeChange={onTimeChange}
              caption={caption}
              progressPercentage={
                (100 * currentSeconds) / totalSeconds
              }
            />
          </div>
        </div>
        <VideoControls
          steps={videoSteps}
          videoTime={videoTime}
          stepIndex={stepIndex}
          onChange={seek}
          play={play}
          pause={pause}
          isPlaying={isPlaying}
        />
      </main>
    </div>
  )
}

function VideoControls({
  steps,
  stepIndex,
  videoTime,
  onChange,
  isPlaying,
  play,
  pause,
}) {
  const {
    currentSeconds,
    getStepAndTime,
    totalSeconds,
  } = useTimeData({
    steps,
    stepIndex,
    videoTime,
  })

  const value = currentSeconds

  const handleChange = values => {
    const value = values[0]
    const { stepIndex, videoTime } = getStepAndTime(value)
    onChange({ stepIndex, videoTime })
  }

  return (
    <>
      {/* <Range
        step={0.1}
        min={0}
        max={totalSeconds}
        values={[value]}
        onChange={handleChange}
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
      /> */}
      <button
        onClick={() =>
          onChange({
            stepIndex: stepIndex - 1,
            videoTime: 0,
          })
        }
      >
        Prev
      </button>
      {isPlaying ? (
        <button onClick={pause}>Pause</button>
      ) : (
        <button onClick={play}>Play</button>
      )}
      <button
        onClick={() =>
          onChange({
            stepIndex: stepIndex + 1,
            videoTime: 0,
          })
        }
      >
        Next
      </button>
      <div style={{ color: "white" }}>{videoTime}</div>
    </>
  )
}

function useCaption(captionSteps, stepIndex, videoTime) {
  const stepCaptions = captionSteps[stepIndex]

  if (!stepCaptions) return null

  const caption = stepCaptions.find(
    ({ start, end }) =>
      start <= videoTime && videoTime < end
  )

  console.log({ stepCaptions, caption, videoTime })

  return caption ? caption.text : null
}
