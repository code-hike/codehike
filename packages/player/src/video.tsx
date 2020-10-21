import React from "react"

const Video = React.forwardRef(VideoWithRef)

export { Video }

export type Step = {
  src: string
  start: number
  end: number
}

export type VideoProps = {
  steps: Step[]
  onTimeChange?: (time: number, prevTime: number) => void
  onStepChange?: (stepIndex: number) => void
  containerStyle: React.CSSProperties | undefined
} & React.PropsWithoutRef<JSX.IntrinsicElements["video"]>

export type PlayerHandle = {
  seek: (stepIndex: number, videoTime: number) => void
  play: () => void
  pause: () => void
}

function VideoWithRef(
  {
    steps,
    onTimeChange = () => {},
    onStepChange = () => {},
    containerStyle,
    ...props
  }: VideoProps,
  parentRef: React.Ref<PlayerHandle>
) {
  const [state, setState] = React.useState({
    stepIndex: 0,
    videoTime: steps[0].start,
  })

  const ref = React.useRef<HTMLVideoElement>(null!)
  const nextRef = React.useRef<HTMLVideoElement>(null!)
  const timeRef = React.useRef(-1)

  React.useImperativeHandle<PlayerHandle, PlayerHandle>(
    parentRef,
    () => ({
      seek: (stepIndex, videoTime) => {
        const newStep = steps[stepIndex]
        const wasPaused = ref.current.paused
        ref.current.src = getSrc(newStep)
        ref.current.currentTime = videoTime
        if (wasPaused) {
          ref.current.pause()
        } else {
          ref.current.play()
        }
        setState({ stepIndex, videoTime })
        onStepChange(stepIndex)
        onTimeChange(videoTime, timeRef.current)
      },
      pause: () => {
        ref.current.pause()
      },
      play: () => {
        ref.current.play()
      },
    }),
    [onStepChange, onTimeChange]
  )

  const currentStep = steps[state.stepIndex]
  const nextStep = steps[state.stepIndex + 1]
  const prevStep = steps[state.stepIndex - 1]

  useAnimationFrame(() => {
    const time = ref.current.currentTime
    if (time != timeRef.current) {
      onTimeChange(time, timeRef.current)
      timeRef.current = time
    }
  }, [onTimeChange])

  const changeStep = () => {
    const video = ref.current
    const nextVideo = nextRef.current
    if (video.currentTime > currentStep.end && nextVideo) {
      nextVideo.play()
      setState({
        stepIndex: state.stepIndex + 1,
        videoTime: nextStep.start,
      })
      onStepChange(state.stepIndex + 1)
    }
  }

  return (
    <div
      style={{ position: "relative", ...containerStyle }}
    >
      {prevStep && (
        <video
          src={getSrc(prevStep)}
          style={{
            ...props.style,
            opacity: 0,
            position: "absolute",
            transition: "opacity 0.5s",
            top: 0,
            left: 0,
          }}
          key={state.stepIndex - 1}
        />
      )}
      <video
        {...props}
        src={getSrc(currentStep)}
        ref={ref}
        key={state.stepIndex}
        style={{
          ...props.style,
          opacity: 1,
          // position: nextStep && "absolute",
          transition: "opacity 0.3s",
          top: 0,
          left: 0,
        }}
        onPause={changeStep}
      />
      {nextStep && (
        <video
          src={getSrc(nextStep)}
          style={{
            ...props.style,
            opacity: 0,
            position: "absolute",
            transition: "opacity 0.2s",
            top: 0,
            left: 0,
          }}
          ref={nextRef}
          key={state.stepIndex + 1}
        />
      )}
    </div>
  )
}

function getSrc({ src, start, end }: Step) {
  return `${src}#t=${start},${end}`
}

// TODO use the rAF from use-spring
function useAnimationFrame(
  callback: () => void,
  deps: React.DependencyList = []
) {
  const requestRef = React.useRef<number>()
  const previousTimeRef = React.useRef<number>()

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      callback()
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, deps)
}
