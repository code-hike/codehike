import * as React from "react"
import { ClasserProvider } from "@code-hike/classer"
import "./index.scss"
import { Swap } from "server-side-media-queries-for-react"
import { HikeProps } from "./hike-context"
import { FluidLayout } from "./fluid-layout"
import { FixedLayout } from "./fixed-layout"

export { Hike }

function Hike({ classes, ...props }: HikeProps) {
  return (
    <ClasserProvider classes={classes}>
      <Swap
        match={[
          [
            "(min-width: 920px)",
            <FluidLayout {...props} />,
          ],
          ["default", <FixedLayout {...props} />],
        ]}
      />
    </ClasserProvider>
  )
}
