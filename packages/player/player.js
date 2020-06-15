import React from "react";
import { VideoPlayer } from "./video-player";
import { Slider } from "./slider";
import { PauseIcon, PlayIcon, LeftIcon, RightIcon } from "./icons";
import s from "./player.module.css";

export { Player };

function Player({
  videoId,
  onChange,
  style,
  steps,
  stepIndex,
  stepProgress,
  isPlaying,
}) {
  const playerRef = React.useRef();
  const showVideo = isPlaying && !steps[stepIndex].hide;
  return (
    <div className={s.player} style={style}>
      {/* <div
        style={{
          position: "absolute",
          fontSize: "1.5em",
          padding: "18px 30px",
          width: 245,
          boxSizing: "border-box",
        }}
      >
        {stepIndex}
      </div> */}
      <div className={s.rightBox}>
        <div
          style={{
            position: "absolute",
            left: 2,
            right: 2,
            top: 2,
            bottom: 2,
            borderRadius: "50%",
            overflow: "hidden",
            background: "rgb(20,20,20)",
          }}
        >
          <VideoPlayer
            ref={playerRef}
            steps={steps}
            videoId={videoId}
            style={{
              transform: "translate(-87px, -327px)",
              // display: !showVideo && "none",
            }}
            onChange={onChange}
          />
          <img
            src="/hooks-talk-thumb.png"
            style={{
              display: showVideo && "none",
              height: "100%",
              position: "absolute",
              top: 0,
            }}
          />
        </div>
        <div className={s.gradient} />
      </div>
      <div className={s.bottomBox}>
        <div style={{ paddingLeft: 22 }}>
          <Button
            onClick={() =>
              playerRef.current.seek(Math.max(stepIndex - 1, 0), 0)
            }
            aria-label="Previous Step"
          >
            <LeftIcon style={{ display: "block" }} />
          </Button>
          <Button
            style={{ padding: "0 12px" }}
            onClick={() => {
              isPlaying ? playerRef.current.pause() : playerRef.current.play();
            }}
          >
            {isPlaying ? (
              <PauseIcon style={{ display: "block" }} aria-label="Pause" />
            ) : (
              <PlayIcon style={{ display: "block" }} aria-label="Play" />
            )}
          </Button>
          <Button
            onClick={() =>
              playerRef.current.seek(
                Math.min(stepIndex + 1, steps.length - 1),
                0
              )
            }
            aria-label="Next Step"
          >
            <RightIcon style={{ display: "block" }} />
          </Button>
        </div>
        <Slider
          inputSteps={steps}
          currentIndex={stepIndex}
          stepProgress={stepProgress}
          isPlaying={isPlaying}
          onChange={({ stepIndex, stepProgress }) =>
            playerRef.current.seek(stepIndex, stepProgress, false)
          }
          style={{ padding: "15px 30px 15px" }}
        />
      </div>
    </div>
  );
}

function Button(props) {
  return (
    <button
      {...props}
      style={{
        font: "inherit",
        background: "transparent",
        cursor: "pointer",
        userSelect: "none",
        padding: "1px 0",
        border: "none",
        color: "#7387c4",
        // height: "30px",
        ...props.style,
      }}
    />
  );
}
