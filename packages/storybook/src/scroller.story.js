import React from "react"
import { Page } from "./utils"
import { Scroller, Step } from "@code-hike/scroller"

export default {
  title: "Test/Scroller",
}

const steps = [1, 2, 3, 4, 5, 6, 7]

export const basic = () => {
  const [index, setIndex] = React.useState(1)
  return (
    <Page style={{ outline: "1px solid salmon" }}>
      <Scroller onStepChange={setIndex}>
        {steps.map(x => (
          <Step key={x} index={x}>
            <Box active={x === index}>{x}</Box>
          </Step>
        ))}
      </Scroller>
    </Page>
  )
}

function Box({ height = 300, active = false, children }) {
  return (
    <div
      style={{
        height,
        margin: "20px 0",
        border: "2px solid blue",
        background: active ? "gray" : "",
        fontSize: "3em",
        padding: "10px",
      }}
    >
      A{children}
    </div>
  )
}
