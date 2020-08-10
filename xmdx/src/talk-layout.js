import React from "react"
import s from "./talk-layout.module.css"
import { Terminal } from "../src/mini-terminal"
import { Video } from "@code-hike/player"

export { TalkLayout }

function TalkLayout({ snippets, clips, steps }) {
  const [stepIndex, setIndex] = React.useState(0)

  return (
    <div className={s.main}>
      <style global jsx>{`
        body {
          margin: 0;
        }
      `}</style>
      <div className={s.content}>
        <div className={s.top}>
          <Terminal snippets={snippets} index={stepIndex} />
          <div className={s.video}>
            <Video
              steps={clips}
              style={{
                height: "200px",
                width: "355.54px",
              }}
              muted
              autoPlay
              onStepChange={setIndex}
            />
          </div>
        </div>
        <div className={s.step}>{steps[stepIndex]}</div>
      </div>
    </div>
  )
}
