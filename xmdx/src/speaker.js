import React from "react"
import s from "./speaker.module.css"
import { Video } from "@code-hike/player"

export const SpeakerPanel = React.forwardRef(
  SpeakerPanelWithRef
)

function SpeakerPanelWithRef(
  {
    videoSteps,
    changeStep,
    onTimeChange,
    progressPercentage,
    caption,
  },
  playerRef
) {
  return (
    <div className={s.video}>
      <div style={{ height: 150, position: "relative" }}>
        <div
          style={{
            height: "100%",
            float: "right",
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
            <a
              style={{
                fontSize: "1.2em",
                color: "#F19A38",
              }}
              href="https://twitter.com/pomber"
            >
              @pomber
            </a>
            <div style={{ height: 5 }} />
            <span style={{ fontSize: "1.8em" }}>
              Rodrigo
            </span>
            <br />
            <span style={{ fontSize: "2em" }}>Pombo</span>
            <div style={{ height: 10 }} />
            <a
              style={{ fontSize: "1.3em", margin: 0 }}
              href="https://mdxjs.com/conf/"
            >
              <span
                children="<"
                style={{
                  color: "#F19A38",
                  fontSize: "1.2em",
                }}
              />
              MDXConf
              <span
                children=" />"
                style={{ color: "#F19A38" }}
              />
            </a>
          </div>
        </div>
      </div>
      <div className={s.progressContainer}>
        <div
          className={s.progress}
          style={{ width: progressPercentage + "%" }}
        />
      </div>
      <div className={s.captions}>{caption}</div>
    </div>
  )
}
