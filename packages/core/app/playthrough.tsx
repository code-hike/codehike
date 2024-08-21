"use client"

import React from "react"

export function Playthrough({ steps }) {
  const [index, setIndex] = React.useState(0)
  const step = steps[index]
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "var(--font-overpass)",
        fontSize: 16,
        lineHeight: 1.5,
        height: "800px",
        colorScheme: "dark",
      }}
    >
      <style jsx global>
        {`
          body {
            background: #242424;
            color: #cccccc;
            margin: 0;
          }

          article {
            max-height: 100vh;
            overflow: hidden;
            height: 100vh;
          }

          a {
            color: rgb(255, 83, 26);
            text-decoration: none;
            box-shadow: inset 0 -1px 0 0 rgb(255, 83, 26);
          }

          a:hover {
            text-decoration: none;
            box-shadow: inset 0 -2px 0 0 rgb(255, 83, 26);
          }
        `}
      </style>
      <div
        style={{
          width: 465,
          borderRight: "2px solid #383838",
          overflowY: "auto",
          padding: "1em",
        }}
      >
        {step.children}
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            setIndex(index + 1)
          }}
        >
          Next
        </a>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>Code</div>
        <div style={{ height: 405 }}>Preview</div>
      </div>
    </div>
  )
}
