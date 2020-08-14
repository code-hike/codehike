import React from "react"
import s from "./index.module.css"
import { MiniEditor } from "@code-hike/mini-editor"
import { MiniBrowser } from "@code-hike/mini-browser"
import { Range, getTrackBackground } from "react-range"
import { Video, useTimeData } from "@code-hike/player"
import { useSpring } from "use-spring"
import { sim } from "@code-hike/sim-user"
import { MDXProvider } from "@mdx-js/react"
import Content from "../demo/cake.mdx"

const components = {
  wrapper: Wrapper,
}

function getStepsFromMDX(children) {
  const splits = [[]]
  React.Children.forEach(children, child => {
    if (child.props.mdxType === "hr") {
      splits.push([])
    } else {
      const lastSplit = splits[splits.length - 1]
      lastSplit.push(child)
    }
  })
  const videoSteps = splits.map(split => {
    const videoElement = split.find(
      child => child.props.mdxType === "Video"
    )
    const props = videoElement.props
    return props
  })

  const browserSteps = splits.map(split => {
    const browserElement = split.find(
      child => child.props.mdxType === "Browser"
    )
    const { url, children, ...rest } = browserElement.props
    const actions = React.Children.map(
      children,
      child => child.props
    )
    // TODO fix production url
    return {
      url: "http://localhost:3000" + url,
      actions,
      ...rest,
    }
  })

  const editorSteps = splits.map(split => {
    const editorElement = split.find(
      child => child.props.mdxType === "Editor"
    )
    const { code, tab, ...rest } = editorElement.props
    return {
      code: require(`!!raw-loader!../demo/${code}`).default,
      file: tab,
      ...rest,
    }
  })

  console.log({ editorSteps })

  return {
    videoSteps,
    browserSteps,
    editorSteps,
  }
}

export default function Page() {
  return (
    <MDXProvider components={components}>
      <Content />
    </MDXProvider>
  )
}

function Wrapper({ children }) {
  const {
    videoSteps,
    browserSteps,
    editorSteps,
  } = getStepsFromMDX(children)
  return (
    <Talk
      videoSteps={videoSteps}
      browserSteps={browserSteps}
      editorSteps={editorSteps}
    />
  )
}

function Talk({ videoSteps, browserSteps, editorSteps }) {
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
              ref={browserRef}
            />
          </div>
          <div className={s.div3}>
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
                  containerStyle={{
                    height: "100%",
                  }}
                  style={{
                    height: "100%",
                  }}
                  muted
                  onStepChange={changeStep}
                  onTimeChange={onTimeChange}
                  ref={playerRef}
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
                  <span style={{ fontSize: "1.2em" }}>
                    @pomber
                  </span>
                  <div style={{ height: 5 }} />
                  <span style={{ fontSize: "1.8em" }}>
                    Rodrigo
                  </span>
                  <br />
                  <span style={{ fontSize: "2em" }}>
                    Pombo
                  </span>
                  <div style={{ height: 10 }} />
                  <span style={{ fontSize: "1.3em" }}>
                    FOO CONF
                  </span>
                </div>
              </div>
            </div>
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
      <Range
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
      />
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
