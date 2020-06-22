import React from "react"

const Row = (props) => (
  <div className="row">
    <span className="row-title">{props.label}</span>
    <span className="row-content">{props.children}</span>
  </div>
)

export default Row
