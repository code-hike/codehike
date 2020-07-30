import React from "react";

export { Video };

type Step = {
  src: string;
  start: number;
  end: number;
};

type VideoProps = {
  steps: Step[];
  onTimeChange?: (time: number) => void;
  onStepChange?: (stepIndex: number) => void;
} & React.PropsWithoutRef<JSX.IntrinsicElements["video"]>;

function Video({
  steps,
  onTimeChange = () => {},
  onStepChange = () => {},
  ...props
}: VideoProps) {
  const [state, setState] = React.useState({
    stepIndex: 0,
    videoTime: steps[0].start,
  });

  const ref = React.useRef<HTMLVideoElement>(null!);
  const nextRef = React.useRef<HTMLVideoElement>(null!);
  const timeRef = React.useRef(-1);

  const currentStep = steps[state.stepIndex];
  const nextStep = steps[state.stepIndex + 1];
  const prevStep = steps[state.stepIndex - 1];

  useAnimationFrame(() => {
    const time = ref.current.currentTime;
    if (time != timeRef.current) {
      onTimeChange(time);
      timeRef.current = time;
    }
  });

  const changeStep = () => {
    const video = ref.current;
    const nextVideo = nextRef.current;
    if (video.currentTime > currentStep.end && nextVideo) {
      nextVideo.play();
      setState({
        stepIndex: state.stepIndex + 1,
        videoTime: nextStep.start,
      });
      onStepChange(state.stepIndex + 1);
    }
  };

  return (
    <>
      {prevStep && (
        <video
          src={getSrc(prevStep)}
          style={{
            ...props.style,
            opacity: 0,
            position: "absolute",
            transition: "opacity 0.5s",
          }}
          key={state.stepIndex - 1}
          id={"" + (state.stepIndex - 1)}
        />
      )}
      <video
        {...props}
        src={getSrc(currentStep)}
        autoPlay
        ref={ref}
        key={state.stepIndex}
        // muted
        style={{
          ...props.style,
          opacity: 1,
          position: nextStep && "absolute",
          transition: "opacity 0.5s",
        }}
        onPause={changeStep}
        id={"" + state.stepIndex}
      />
      {nextStep && (
        <video
          src={getSrc(nextStep)}
          style={{
            ...props.style,
            opacity: 0,
            // position: "absolute",
            transition: "opacity 0.5s",
          }}
          ref={nextRef}
          key={state.stepIndex + 1}
          id={"" + (state.stepIndex + 1)}
        />
      )}
    </>
  );
}

function getSrc({ src, start, end }: Step) {
  return `${src}#t=${start},${end}`;
}

function useAnimationFrame(callback: () => void) {
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      callback();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);
}
