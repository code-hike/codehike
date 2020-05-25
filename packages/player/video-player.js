import React from "react";
import { useInterval } from "./use-interval";
import YouTube from "react-youtube";

export { VideoPlayer };

const VideoPlayer = React.forwardRef(
  ({ steps, onChange, style, videoId }, parentRef) => {
    const opts = {
      height: "500",
      width: "800",
      playerVars: {
        controls: 0,
        autoplay: 1,
        disablekb: 1,
        modestbranding: 1,
        origin: "codehike.org",
        fs: 0,
        start: steps[0].start,
      },
    };

    const playerRef = React.useRef({ player: null, state: initState(steps) });

    useInterval(() => {
      const { player, state } = playerRef.current;
      // TODO fix initial buffering (time is 0, maybe use that as condition)
      if (!player || player.getPlayerState() === 3) return;

      const time = player.getCurrentTime();
      const { pause, seek } = state.tick(time);
      const newTime = state.getTime();

      if (pause) {
        player.pauseVideo();
      }

      if (seek) {
        player.seekTo(newTime, true);
      }

      // console.log("tick change", state.get(), time, player.getPlayerState());
      onChange && onChange(state.get());
    }, 100);

    React.useImperativeHandle(parentRef, () => ({
      seek: (stepIndex, stepProgress, ahead) => {
        const { player, state } = playerRef.current;
        state.seek(stepIndex, stepProgress);
        const newTime = state.getTime();
        player.seekTo(newTime, true);
        // console.log("imp change", state.get());
        onChange(state.get());
      },
      play: () => playerRef.current.player.playVideo(),
      pause: () => playerRef.current.player.pauseVideo(),
    }));

    return (
      <div style={style}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={({ target }) => {
            playerRef.current.player = target;
          }}
          onStateChange={() => {
            const { state, player } = playerRef.current;
            state.playingChange(player.getPlayerState());
            // console.log("stat change", state.get());
            onChange(state.get());
          }}
        />
      </div>
    );
  }
);

function initState(steps) {
  const state = {
    currentIndex: 0,
    stepProgress: 0,
    isPlaying: true,
  };

  return {
    get: () => ({
      stepIndex: state.currentIndex,
      stepProgress: state.stepProgress,
      isPlaying: state.isPlaying,
    }),
    getTime: () => {
      return steps[state.currentIndex].start + state.stepProgress;
    },
    seek: (stepIndex, stepProgress) => {
      state.currentIndex = stepIndex;
      state.stepProgress = stepProgress;
    },
    playingChange: (playerState) => {
      // https://developers.google.com/youtube/iframe_api_reference#Playback_status
      state.isPlaying = playerState === 1;
    },
    tick: (time) => {
      const currentStep = steps[state.currentIndex];
      const stepChanged = time >= currentStep.end;

      if (!stepChanged) {
        state.stepProgress = time - currentStep.start;
        return {};
      }

      const isLastStep = state.currentIndex === steps.length - 1;
      if (isLastStep) {
        state.stepProgress = currentStep.end - currentStep.start;
        return { pause: true };
      }

      const nextStep = steps[state.currentIndex + 1];
      const jump = currentStep.end !== nextStep.start;
      if (jump) {
        state.currentIndex++;
        state.stepProgress = 0;
        return { seek: true };
      } else {
        state.currentIndex++;
        state.stepProgress = time - nextStep.start;
        return {};
      }
    },
  };
}
