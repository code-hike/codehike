import React from "react";
import { VideoPlayer } from "./video-player";
import { Slider } from "./slider";
import { PauseIcon, PlayIcon, LeftIcon, RightIcon } from "./icons";

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
  return (
    <div
      style={{
        borderRadius: "6px",
        boxShadow:
          "0 13px 27px -5px rgba(50,50,93,.25), 0 8px 16px -8px rgba(0,0,0,.3), 0 -6px 16px -6px rgba(0,0,0,.025)",
        overflow: "hidden",
        background: "rgb(30, 30, 30)",
        position: "relative",
        color: "#ddd",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          fontSize: "1.5em",
          padding: "18px 30px",
          width: 245,
          boxSizing: "border-box",
        }}
      >
        1/5 State in class components
      </div>
      <div
        style={{
          position: "absolute",
          // borderRadius: "50%",
          overflow: "hidden",
          height: 185,
          width: 185,
          right: 10,
        }}
      >
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
              transform: "translate(-74px, -278px)",
            }}
            onChange={onChange}
          />
        </div>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            backgroundImage: `radial-gradient(
              transparent 30%,
              rgb(20, 20, 20) 48%,
              rgb(30, 30, 30) 66%
            )`,
          }}
        ></div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          // background: "salmon",
          // height: 20,
        }}
      >
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
