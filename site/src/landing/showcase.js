import React from "react"
import s from "./showcase.module.css"

export { Showcase }

function Showcase() {
  return (
    <section className={s.showcase}>
      <h2 className={s.title}>Showcase</h2>
      <Carousel>
        <div>
          <div></div>
          <h3>Talk</h3>
        </div>
        <div>
          <div></div>
          <h3>Tutorial</h3>
        </div>
        <div>
          <div></div>
          <h3>Mini Docs</h3>
        </div>
      </Carousel>
    </section>
  )
}

function Carousel({ children }) {
  const kids = React.Children.toArray(children)
  const [step, setStep] = React.useState(0)
  return (
    <div className={s.carousel}>
      <div className={s.container}>
        <Slide>{kids[step]}</Slide>
        <Slide className={s.left}>
          {kids[modulo(step - 1, kids)]}
        </Slide>
        <Slide className={s.right}>
          {kids[modulo(step + 1, kids)]}
        </Slide>
        <button
          className={`${s.carouselButton} ${s.left}`}
          onClick={() => setStep(modulo(step - 1, kids))}
        >
          Prev
        </button>
        <button
          className={`${s.carouselButton} ${s.right}`}
          onClick={() => setStep(modulo(step + 1, kids))}
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

function modulo(i, list) {
  return (i + list.length) % list.length
}
