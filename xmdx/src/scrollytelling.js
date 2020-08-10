import {
  Scroller,
  Step as ScrollerStep,
} from "@code-hike/scroller"
import s from "./scrollytelling.module.css"

export { Scrollytelling }

function Scrollytelling({ steps, stickers, sticker }) {
  const [stepIndex, setIndex] = React.useState(0)
  return (
    <div className={s.main}>
      <div className={s.content}>
        <Scroller onStepChange={setIndex}>
          {steps.map((c, i) => (
            <ScrollerStep
              key={i}
              id={`step-${i}`}
              index={i}
              className={s.step}
              style={{
                opacity: stepIndex === i ? 0.99 : 0.4,
              }}
            >
              {c}
            </ScrollerStep>
          ))}
        </Scroller>
      </div>
      <div className={s.sticker}>
        <div>
          {sticker
            ? sticker(stepIndex)
            : stickers[stepIndex]}
        </div>
      </div>
    </div>
  )
}
