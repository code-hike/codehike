"use client"

import React from "react"

export function Scrollycoding({ steps }) {
  // console.log("Scrollycoding", steps)
  const [currentStep, setCurrentStep] = React.useState(0)
  return (
    <div
      style={{
        border: "1px solid red",
        margin: "1em",
        display: "flex",
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        {steps.map((step, i) => {
          return (
            <div
              style={{
                border: "1px solid red",
                margin: "1em",
              }}
              key={i}
              onClick={() => setCurrentStep(i)}
            >
              {step.children}
            </div>
          )
        })}
      </div>
      <div style={{ minWidth: 300 }}>
        {steps[currentStep].code}
      </div>
    </div>
  )
}
