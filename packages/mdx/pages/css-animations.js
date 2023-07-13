import React from "react"
import { setLines } from "../src/lines"

const a = [
  { content: "A1", id: "1" },
  { content: "A2", id: "2" },
  { content: "A3", id: "3" },
  { content: "A4", id: "4" },
  { content: "A5", id: "5" },
]

const b = [
  { content: "A1", id: "1" },
  { content: "B1", id: "1.5" },
  { content: "A2", id: "2" },
  { content: "A3", id: "3" },
  { content: "A5", id: "5" },
]

const c = [
  { content: "B1", id: "1.5" },
  { content: "C1", id: "1.6" },
  { content: "A3", id: "3" },
]

export default function Home() {
  return <Code lines={a} />
}

function Code({ lines }) {
  const ref = React.useRef()
  console.log("render")
  return (
    <div>
      <nav
        style={{ margin: "0 auto", textAlign: "center" }}
      >
        <button onClick={() => setLines(ref.current, a)}>
          A
        </button>
        <button onClick={() => setLines(ref.current, b)}>
          B
        </button>
        <button onClick={() => setLines(ref.current, c)}>
          C
        </button>
      </nav>
      <main className="code" ref={ref}>
        {lines.map((line, i) => {
          return (
            <div
              key={line.id}
              className="line"
              data-ch-lid={line.id}
            >
              {line.content}
            </div>
          )
        })}
      </main>
    </div>
  )
}
