import React from "react"
import { SmoothLines } from "@code-hike/smooth-lines"
import { WithProgress } from "./utils"

export default {
  title: "Test/Smooth Lines",
  argTypes: {
    center: { control: "boolean" },
    containerWidth: {
      control: {
        type: "range",
        min: 100,
        max: 200,
        step: 1,
      },
      defaultValue: 150,
    },
    minZoom: {
      control: {
        type: "range",
        min: 0,
        max: 1,
        step: 0.1,
      },
      defaultValue: 0.2,
    },
  },
}

export const basic = ({
  center,
  containerWidth,
  minZoom,
}) => (
  <WithProgress>
    {progress => (
      <div
        style={{
          outline: "1px solid salmon",
          alignSelf: "center",
        }}
      >
        <SmoothLines
          center={center}
          progress={progress}
          containerWidth={containerWidth}
          containerHeight={100 + progress * 30}
          prevLines={prevLines}
          nextLines={nextLines}
          lineHeight={lineHeight}
          lineWidth={lineWidth}
          prevFocus={[1, 1]}
          nextFocus={[3, 11]}
          minZoom={minZoom}
        />
      </div>
    )}
  </WithProgress>
)

export const verticalCenter = ({
  containerWidth,
  center,
}) => (
  <WithProgress>
    {progress => (
      <div
        style={{
          outline: "1px solid salmon",
          alignSelf: "center",
        }}
      >
        <SmoothLines
          center={center}
          progress={progress}
          containerWidth={containerWidth}
          containerHeight={100 + progress * 50}
          prevLines={[
            {
              element: <Line height={100}>One</Line>,
              hey: 1,
            },
          ]}
          nextLines={[
            {
              element: <Line height={100}>One</Line>,
              hey: 1,
            },
          ]}
          lineHeight={100}
          lineWidth={lineWidth}
          prevFocus={[0, 0]}
          nextFocus={[0, 0]}
        />
      </div>
    )}
  </WithProgress>
)

export const dynamicLineWidth = ({
  center,
  containerWidth,
  minZoom,
}) => {
  const prevLines = [
    { element: <Line>One</Line>, key: 1 },
    { element: <Line>Two</Line>, key: 2 },
    { element: <Line>Three</Line>, key: 3 },
  ]
  const nextLines = [
    { element: <Line>One</Line>, key: 1 },
    {
      element: <Line width={lineWidth * 2}>Alpha</Line>,
      key: 1.1,
    },
    { element: <Line>Beta</Line>, key: 1.2 },
    { element: <Line>Three</Line>, key: 3 },
    {
      element: <Line width={lineWidth * 2}>Gamma</Line>,
      key: 3.3,
    },
  ]

  return (
    <WithProgress>
      {progress => (
        <div
          style={{
            outline: "1px solid salmon",
            alignSelf: "center",
          }}
        >
          <SmoothLines
            center={center}
            progress={progress}
            containerWidth={containerWidth}
            containerHeight={100 + progress * 30}
            prevLines={prevLines}
            nextLines={nextLines}
            lineHeight={lineHeight}
            lineWidth={[lineWidth, lineWidth * 2]}
            prevFocus={[1, 1]}
            nextFocus={[2, 2]}
            minZoom={minZoom}
          />
        </div>
      )}
    </WithProgress>
  )
}

const prevLines = [
  { element: <Line>Hi</Line>, key: 1 },
  { element: <Line>Smooth**</Line>, key: 2 },
  { element: <Line>Smoooth</Line>, key: 2.8 },
  { element: <Line>Lines</Line>, key: 3 },
  { element: <Line>New 2</Line>, key: 5.1 },
]
const nextLines = [
  { element: <Line>Hi</Line>, key: 1 },
  { element: <Line>New</Line>, key: 2.1 },
  { element: <Line>Lines</Line>, key: 3 },
  { element: <Line>New 2</Line>, key: 3.1 },
  { element: <Line>Lines</Line>, key: 4 },
  { element: <Line>New 2</Line>, key: 5.1 },
  { element: <Line>New 2</Line>, key: 6.1 },
  { element: <Line>Lines</Line>, key: 6.2 },
  { element: <Line>New 2</Line>, key: 6.3 },
  { element: <Line>New 2**</Line>, key: 7.1 },
  { element: <Line>Lines</Line>, key: 7.2 },
  { element: <Line>New 2</Line>, key: 7.3 },
]

const lineHeight = 20
const lineWidth = 120

function Line({ children, width, height }) {
  return (
    <div
      style={{
        background: "lightblue",
        border: "2px solid blue",
        height: height || lineHeight,
        width: width || lineWidth,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  )
}
