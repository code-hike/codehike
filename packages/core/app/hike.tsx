"use client"
import React from "react"

export function Hike({ children, as, ...rest }) {
  console.log("client steps", children)

  const steps = React.Children.toArray(children).map(
    (stepElement: any) => {
      const slotElements = React.Children.toArray(
        stepElement?.props?.children
      )
      const step = {}

      slotElements.forEach((slotElement: any) => {
        step[slotElement.props.className] =
          slotElement.props.children
      })

      return step
    }
  )

  console.log("steps", steps)

  return React.createElement(
    as,
    { steps, ...rest },
    children
  )
}
