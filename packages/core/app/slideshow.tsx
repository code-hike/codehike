"use client"

import React from "react"

export function Slideshow({ steps }) {
  // console.log("Scrollycoding", steps)
  const [currentStep, setCurrentStep] = React.useState(0)
  const step = steps[currentStep]
  return (
    <div
      style={{
        border: "1px solid red",
        margin: "1em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex" }}>
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0}
        >
          Prev
        </button>
        <input
          style={{ flex: 1 }}
          type="range"
          min={0}
          max={steps.length - 1}
          value={currentStep}
          onChange={e =>
            setCurrentStep(parseInt(e.target.value))
          }
        />
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </button>
      </div>
      <div>{step.children}</div>
      <div style={{ minWidth: 300 }}>{step.code}</div>
    </div>
  )
}
