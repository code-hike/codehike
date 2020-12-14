import React from "react"

interface CodeWalkStep {
  code?: string
  focus?: string
  // TODO this shoudln't change between steps
  lang?: string
}

interface CodeWalkProps
  extends React.PropsWithoutRef<
    JSX.IntrinsicElements["div"]
  > {
  /** A number between 0 and `steps.length - 1`. */
  progress?: number
  /** Default code for all steps. */
  code?: string
  /** Default focus for all steps. */
  focus?: string
  lang?: string
  steps?: CodeWalkStep[]
  parentHeight?: number
  minColumns?: number
}

export { CodeWalk }

function CodeWalk({
  steps = [],
  ...rest
}: CodeWalkProps): React.ReactNode {
  if (steps.length === 0) return null
  return <div {...rest} />
}
