import React from "react"
import { Page } from "./utils"
import { SmoothColumn } from "@code-hike/smooth-column"

export default {
  title: "Smooth Column",
}
export const basic = () => {
  const padding = 10
  const steps = [
    {
      items: [
        { height: 100, element: <Div /> },
        { height: 200, element: <Div /> },
      ],
    },
  ]

  return (
    <Page>
      <SmoothColumn
        steps={steps}
        padding={padding}
        progress={0}
      />
    </Page>
  )
}

function Div() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "salmon",
        outline: "1px solid blue",
      }}
    >
      Hi
    </div>
  )
}
