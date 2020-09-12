import React from "react"
import s from "./showcase.module.css"

export { Showcase }

function Showcase() {
  return (
    <section>
      <h2 className={s.title}>Showcase</h2>
      <Carrousel>
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
      </Carrousel>
    </section>
  )
}

function Carrousel({ children }) {
  const kids = React.Children.toArray(children)
  const [step, setStep] = React.useState(0)
  return (
    <div>
      <button
        onClick={() => setStep(modulo(step - 1, kids))}
      >
        Prev
      </button>
      {kids[step]}
      <button
        onClick={() => setStep(modulo(step + 1, kids))}
      >
        Next
      </button>
    </div>
  )
}

function modulo(i, list) {
  return (i + list.length) % list.length
}
