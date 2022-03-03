import React from "react"
import { WithProgress } from "./utils"
import { SmoothColumn } from "@code-hike/smooth-column"

export default {
  title: "Test/Smooth Column",
}
export const oneExitOneEnter = () => {
  const padding = 10
  const steps = [
    {
      items: [{ height: 200, element: <Div /> }],
    },
    {
      items: [{ height: 300, element: <Div />, id: "b" }],
    },
  ]

  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <div
          style={{
            height: "80vh",
            outline: "1px solid green",
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <SmoothColumn
            style={{ width: "100%" }}
            steps={steps}
            padding={padding}
            progress={progress}
            backward={backward}
          />
        </div>
      )}
    </WithProgress>
  )
}

export const oneExitOneStaysOneEnter = () => {
  const padding = 10
  const steps = [
    {
      items: [
        { height: 50, element: <Div /> },
        { height: 100, element: <Div />, id: "b" },
      ],
    },
    {
      items: [
        { height: 100, element: <Div />, id: "b" },
        { height: 100, element: <Div />, id: "c" },
      ],
    },
  ]

  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <div
          style={{
            height: "80vh",
            outline: "1px solid green",
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <SmoothColumn
            style={{ width: "100%" }}
            steps={steps}
            padding={padding}
            progress={progress}
            backward={backward}
          />
        </div>
      )}
    </WithProgress>
  )
}

export const twoSteps = () => {
  const padding = 10
  const steps = [
    {
      items: [
        { height: 100, element: <Div /> },
        { height: 200, element: <Div />, id: "b" },
      ],
    },
    {
      items: [{ height: 200, element: <Div />, id: "b" }],
    },
    {
      items: [
        { height: 200, element: <Div />, id: "b" },
        { height: 300, element: <Div />, id: "c" },
      ],
    },
    {
      items: [
        { height: 100, element: <Div /> },
        { height: 100, element: <Div /> },
      ],
    },
  ]

  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <div
          style={{
            height: "80vh",
            outline: "1px solid green",
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <SmoothColumn
            style={{ width: "100%" }}
            steps={steps}
            padding={padding}
            progress={progress}
            backward={backward}
          />
        </div>
      )}
    </WithProgress>
  )
}

export const variableHeight = () => {
  const padding = 10
  const steps = [
    {
      items: [
        { height: 100, element: <Div /> },
        { height: 200, element: <Div />, id: "b" },
      ],
    },
    {
      items: [{ height: 150, element: <Div />, id: "b" }],
    },
    {
      items: [
        { height: 100, element: <Div />, id: "b" },
        { height: 100, element: <Div />, id: "c" },
      ],
    },
  ]

  return (
    <WithProgress length={steps.length}>
      {(progress, backward) => (
        <div
          style={{
            height: "80vh",
            outline: "1px solid green",
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <SmoothColumn
            style={{ width: "100%" }}
            steps={steps}
            padding={padding}
            progress={progress}
            backward={backward}
          />
        </div>
      )}
    </WithProgress>
  )
}

function Div({ height }) {
  return (
    <div
      style={{
        height: height,
        width: "100%",
        background: "salmon",
        outline: "1px solid blue",
      }}
    ></div>
  )
}
