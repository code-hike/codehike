import React from "react"
import { Page } from "./utils"
import { sim } from "@code-hike/sim-user"

export default {
  title: "Test/Sim User",
}
export const click = () => {
  const [count, setCount] = React.useState(0)

  return (
    <Page>
      <h1
        id="inc"
        style={{
          background: "salmon",
          textAlign: "center",
        }}
        onClick={() => setCount(count + 1)}
      >
        {count}
      </h1>
      <button
        onClick={() => {
          sim({ type: "click", selector: "#inc" })
        }}
      >
        Simulate Click
      </button>
    </Page>
  )
}
