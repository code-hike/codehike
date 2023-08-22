"use-client"

import React from "react"
import { animate } from "./flip-animate"

export class Flip extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const snapshot = getSnapshot(this.ref.current)
    return snapshot
  }

  componentDidUpdate(prevProps, prevState, firstSnapshot) {
    const parent = this.ref.current
    const elements = parent.querySelectorAll("[ch-x]")

    // stop all animations
    elements.forEach(el => {
      el.getAnimations().forEach(a => {
        a.cancel()
      })
    })

    const lastSnapshot = getSnapshot(parent)
    animate(elements, firstSnapshot, lastSnapshot)
  }

  render() {
    return (
      <pre
        ref={this.ref}
        style={{
          padding: "1rem",
          width: "600px",
          margin: "2rem auto",
          position: "relative",
          lineHeight: "1.3",
          fontSize: "1.1rem",
          backgroundColor: "#222",
          borderRadius: "0.5rem",
        }}
      >
        {this.props.children}
      </pre>
    )
  }
}

function getSnapshot(parent) {
  const snapshot = {}
  parent.querySelectorAll("[ch-x]").forEach(el => {
    const id = el.getAttribute("ch-x")
    const { x, y } = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    const opacity = Number(style.opacity) ?? 1
    const color = style.color

    snapshot[id] = { x, y, opacity, color }
  })
  return snapshot
}
