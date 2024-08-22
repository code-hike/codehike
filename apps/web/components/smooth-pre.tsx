"use client"

import React from "react"
import { AnnotationHandler, InnerToken, Pre } from "codehike/code"
import {
  TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "codehike/utils/token-transitions"

const MAX_TRANSITION_DURATION = 900 // milliseconds

type PreProps = React.ComponentProps<typeof Pre>
export class SmoothPre extends React.Component<PreProps> {
  ref: React.RefObject<HTMLPreElement>

  constructor(props: PreProps) {
    super(props)
    this.ref = React.createRef<HTMLPreElement>()
  }

  render() {
    const handlers = [inlineBlockToken, ...(this.props.handlers || [])]
    const style = { ...this.props.style, position: "relative" as const }
    const props = { ...this.props, style, handlers }
    return <Pre ref={this.ref} {...props} />
  }

  getSnapshotBeforeUpdate() {
    return getStartingSnapshot(this.ref.current!)
  }

  componentDidUpdate(
    prevProps: PreProps,
    prevState: never,
    snapshot: TokenTransitionsSnapshot,
  ) {
    const transitions = calculateTransitions(this.ref.current!, snapshot)
    transitions.forEach(({ element, keyframes, options }) => {
      const { translateX, translateY, ...kf } = keyframes as any
      if (translateX && translateY) {
        kf.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ]
      }
      element.animate(kf, {
        duration: options.duration * MAX_TRANSITION_DURATION,
        delay: options.delay * MAX_TRANSITION_DURATION,
        easing: options.easing,
        fill: "both",
      })
    })
  }
}

const inlineBlockToken: AnnotationHandler = {
  name: "inline-block",
  Token: (props) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
}
