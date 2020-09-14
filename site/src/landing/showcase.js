import React from "react"
import s from "./showcase.module.css"
import { useSpring } from "use-spring"

export { Showcase }

function Showcase() {
  return (
    <section className={s.showcase}>
      <h2 className={s.title}>Showcase</h2>
      <Carousel>
        <div>
          <h3>0 Talk</h3>
          <div
            style={{
              width: 200,
              height: 150,
              background: "#222",
              margin: "0 auto",
            }}
          />
        </div>
        <div>
          <h3>1 Tutorial</h3>
          <div
            style={{
              width: 200,
              height: 150,
              background: "#222",
              margin: "0 auto",
            }}
          />
        </div>
        <div>
          <h3>2 Mini Docs</h3>
          <div
            style={{
              width: 200,
              height: 150,
              background: "#222",
              margin: "0 auto",
            }}
          />
        </div>
      </Carousel>
    </section>
  )
}

function Carousel({ children }) {
  const kids = React.Children.toArray(children)
  const [step, setStep] = React.useState(0)
  const [progress] = useSpring(step)
  const {
    leftIndex,
    middleIndex,
    rigthIndex,
    translatePercentage,
  } = getIndexes(progress, kids.length)
  console.log({ leftIndex, middleIndex })
  return (
    <div className={s.carousel}>
      <div className={s.container}>
        <div
          className={s.centerContainer}
          style={{
            transform: `translateX(${-translatePercentage}%)`,
          }}
        >
          <Slide key={middleIndex}>
            {kids[middleIndex]}
          </Slide>
          <Slide className={s.left} key={leftIndex}>
            {kids[leftIndex]}
          </Slide>
          <Slide className={s.right} key={rigthIndex}>
            {kids[rigthIndex]}
          </Slide>
        </div>
        <button
          className={`${s.carouselButton} ${s.left}`}
          onClick={() => setStep(step - 1)}
        >
          Prev
        </button>
        <button
          className={`${s.carouselButton} ${s.right}`}
          onClick={() => setStep(step + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

function Slide({ children, className }) {
  return (
    <div
      className={`${s.slideContainer} ${className || ""}`}
    >
      <div className={s.slide}>{children}</div>
    </div>
  )
}

function getIndexes(progress, listLength) {
  const stepProgress = progress % 1
  const middle =
    stepProgress <= 0.5
      ? Math.floor(progress)
      : Math.ceil(progress)
  const left = middle - 1
  const right = middle + 1
  return {
    leftIndex: modulo(left, listLength),
    middleIndex: modulo(middle, listLength),
    rigthIndex: modulo(right, listLength),
    translatePercentage:
      stepProgress <= 0.5
        ? (progress % 1) * 100
        : ((progress % 1) - 1) * 100,
  }
}

function modulo(i, listLength) {
  return (i + listLength) % listLength
}
