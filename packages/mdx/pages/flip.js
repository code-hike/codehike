import React from "react"

export default function Page() {
  const [x, setX] = React.useState(100)

  return (
    <div>
      <button
        onClick={() =>
          setX(x * (Math.max(Math.random(), 0.3) + 0.5))
        }
      >
        Change
      </button>
      <Flip2 x={x} />
    </div>
  )
}

function Flip({ x }) {
  const flipRef = React.useRef({ first: null, last: null })
  const divRef = React.useRef()
  const [w, setW] = React.useState(x)

  React.useLayoutEffect(() => {
    if (w !== x) {
      flipRef.current.first = getRect(divRef)
      console.log("first", flipRef.current.first)
      setW(x)
    } else if (flipRef.current.first) {
      flipRef.current.last = getRect(divRef)
      console.log("last", flipRef.current.last)
      invert(divRef, flipRef)
    } else {
      console.log("first render, no prev")
    }
  })

  return (
    <div ref={divRef}>
      <Marginal left={w} />
    </div>
  )
}

function getRect(divRef) {
  const div = divRef.current
  const rect = div
    .querySelector("[ch-k='1']")
    .getBoundingClientRect()
  const { x, y } = rect
  return { x, y }
}

function invert(divRef, flipRef) {
  console.log("invert")
  const el = divRef.current.querySelector("[ch-k='1']")
  const dx =
    flipRef.current.first.x - flipRef.current.last.x
  const dy =
    flipRef.current.first.y - flipRef.current.last.y

  el.animate(
    {
      transform: [
        `translate(${dx}px, ${dy}px)`,
        "translate(0, 0)",
      ],
    },
    {
      duration: 500,
      easing: "ease-in-out",
      fill: "both",
    }
  )
}

const Marginal = React.memo(({ left }) => {
  console.log("Marginal", left)
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: left }}></div>
      <div ch-k="1" key="1">
        hey
      </div>
    </div>
  )
})

class Flip2 extends React.Component {
  constructor(props) {
    super(props)
    this.divRef = React.createRef()
    this.flipRef = React.createRef()
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.divRef.current) {
      return getRect(this.divRef)
    }
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      const rect = getRect(this.divRef)
      const dx = snapshot.x - rect.x
      const dy = snapshot.y - rect.y
      const el =
        this.divRef.current.querySelector("[ch-k='1']")
      el.animate(
        {
          transform: [
            `translate(${dx}px, ${dy}px)`,
            "translate(0, 0)",
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          fill: "both",
        }
      )
    }
  }

  render() {
    const { x } = this.props
    return (
      <div ref={this.divRef}>
        <Marginal left={x} />
      </div>
    )
  }
}
