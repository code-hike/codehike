import React from "react"
import { diff, tokenize, withIds } from "../src/differ"

export function Code({ tokens }) {
  const tokensWithIds = withIds(tokens)
  const prevTokens = usePrevProps(tokensWithIds)
  return (
    <CodeTransition
      currentTokens={tokensWithIds}
      previousTokens={prevTokens}
    />
  )
}

function CodeTransition({ currentTokens, previousTokens }) {
  const ref = React.useRef()
  let tokens = currentTokens
  if (previousTokens) {
    const result = diff(previousTokens, currentTokens)
    tokens = result
  }

  React.useLayoutEffect(() => {
    setTokens(ref.current, previousTokens, tokens)
  }, [currentTokens])

  return (
    <pre
      style={{
        padding: "1rem",
        width: "600px",
        margin: "2rem auto",
        position: "relative",
        lineHeight: "1.3",
        fontSize: "1.1rem",
        // transformStyle: "preserve-3d",
        // transform: "translateZ(0)",
        // filter: "blur(0)",
      }}
      ref={ref}
    />
  )
}

function usePrevProps(props) {
  const ref = React.useRef()
  React.useEffect(() => {
    ref.current = props
  })
  return ref.current
}

function initTokens(parent, tokens) {
  parent.innerHTML = ""
  tokens.forEach((token, i) => {
    parent.appendChild(createSpan(token))
  })
}

const config = {
  removeDuration: 50,
  moveDuration: 300,
  addDuration: 500,
}

function setTokens(parent, prevTokens, nextTokens) {
  if (!prevTokens) {
    initTokens(parent, nextTokens)
    return
  }

  const prevSpanData = prevTokens.filter(t => t.style)
  const nextSpanData = nextTokens.filter(t => t.style)
  // console.log({ prevSpanData, nextSpanData })

  const prevSpanRect = []
  const { x: parentX, y: parentY } =
    parent.getBoundingClientRect()

  parent.childNodes.forEach(span => {
    if (span.tagName !== "SPAN") return
    const rect = span.getBoundingClientRect()
    prevSpanRect.push({
      dx: rect.x - parentX,
      dy: rect.y - parentY,
    })
  })

  initTokens(parent, nextTokens)

  const nextSpanRect = []
  parent.childNodes.forEach(span => {
    if (span.tagName !== "SPAN") return
    const rect = span.getBoundingClientRect()

    nextSpanRect.push({
      dx: rect.x - parentX,
      dy: rect.y - parentY,
    })
  })

  // console.log({ prevSpanRect, nextSpanRect })

  const moved = []
  const added = []
  // change styles
  const childSpans = [...parent.childNodes].filter(
    e => e.tagName == "SPAN"
  )

  childSpans.forEach((span, i) => {
    const id = Number(span.getAttribute("id"))
    const prevIndex = prevSpanData.findIndex(
      t => t.id === id
    )
    const nextIndex = nextSpanData.findIndex(
      t => t.id === id
    )

    if (prevIndex === -1) {
      const lastGroup = added[added.length - 1]
      const lastSpan = lastGroup?.[lastGroup.length - 1]
      if (lastSpan?.i === i - 1) {
        lastGroup.push({ span, i })
      } else {
        added.push([{ span, i }])
      }
      return
    }

    const dx =
      prevSpanRect[prevIndex].dx -
      nextSpanRect[nextIndex].dx
    const dy =
      prevSpanRect[prevIndex].dy -
      nextSpanRect[nextIndex].dy

    const item = {
      span,
      i,
      dx: Math.round(dx * 100) / 100,
      dy: Math.round(dy * 100) / 100,
      fromColor: prevSpanData[prevIndex].style.color,
      toColor: nextSpanData[nextIndex].style.color,
      bwd: dy > 0 || (dy == 0 && dx > 0),
    }

    if (
      item.dx === 0 &&
      item.dy === 0 &&
      item.fromColor === item.toColor
    ) {
      return
    }

    const lastGroup = moved[moved.length - 1]
    const lastSpan = lastGroup?.[lastGroup.length - 1]
    if (
      lastSpan?.i === i - 1 &&
      lastSpan?.dx === item.dx &&
      lastSpan?.dy === item.dy
    ) {
      lastGroup.push(item)
    } else {
      moved.push([item])
    }
  })

  const nextIds = nextSpanData.map(t => t.id)
  const removed = []
  prevSpanData.forEach((token, i) => {
    if (!nextIds.includes(token.id)) {
      const prevRect = prevSpanRect[i]
      const span = createSpan(token)
      span.style.setProperty("top", `${prevRect.dy}px`)
      span.style.setProperty("left", `${prevRect.dx}px`)
      span.style.setProperty("position", "absolute")
      parent.appendChild(span)

      const lastGroup = removed[removed.length - 1]
      const lastSpan = lastGroup?.[lastGroup.length - 1]
      if (lastSpan?.i === i - 1) {
        lastGroup.push({ span, i })
      } else {
        removed.push([{ span, i }])
      }
    }
  })

  const removeDuration = fullStaggerDuration(
    removed.length,
    config.removeDuration
  )
  const moveDuration = fullStaggerDuration(
    moved.length,
    config.moveDuration
  )
  const addDuration = fullStaggerDuration(
    added.length,
    config.addDuration
  )

  // sort moved, first bwd moves, then fwd moves (inverted)
  moved.sort((group1, group2) => {
    const [item1] = group1
    const [item2] = group2

    if (item1.bwd && !item2.bwd) return -1
    if (!item1.bwd && item2.bwd) return 1
    if (item1.bwd && item2.bwd) return item1.i - item2.i
    if (!item1.bwd && !item2.bwd) return item2.i - item1.i
    return 0
  })

  console.log(
    moved.map(g => ({ bwd: g[0].bwd, i: g[0].i }))
  )

  removed.forEach((group, i) => {
    group.forEach(({ span }) => {
      span.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: removeDuration,
        fill: "both",
        easing: "ease-out",
        delay: staggerDelay(
          i,
          removed.length,
          removeDuration,
          config.removeDuration
        ),
      })
    })
  })

  moved.forEach((group, i) => {
    group.forEach(
      ({ span, dx, dy, fromColor, toColor }) => {
        const transform = `translateX(${dx}px) translateY(${dy}px)`
        span.animate(
          {
            transform: [
              transform,
              "translateX(0px) translateY(0px)",
            ],
            color: [fromColor, toColor],
          },
          {
            duration: config.moveDuration,
            fill: "both",
            easing: "ease-in-out",
            delay:
              removeDuration +
              staggerDelay(
                i,
                moved.length,
                moveDuration,
                config.moveDuration
              ),
          }
        )
      }
    )
  })

  added.forEach((group, i) => {
    group.forEach(({ span }) => {
      span.animate(
        {
          opacity: [0, 0.9, 1],
          filter: [
            "brightness(1)",
            "brightness(1.4)",
            "brightness(1)",
          ],
        },
        {
          duration: config.addDuration,
          fill: "both",
          easing: "ease-in",
          delay:
            removeDuration +
            config.moveDuration +
            staggerDelay(
              i,
              added.length,
              addDuration,
              config.addDuration
            ),
        }
      )
    })
  })
}

function createSpan(token) {
  if (!token.style) {
    return document.createTextNode(token.content)
  }
  const span = document.createElement("span")
  span.textContent = token.content

  // set id
  span.setAttribute("id", token.id)

  // set style
  Object.entries(token.style).forEach(([key, value]) => {
    span.style.setProperty(key, value)
  })
  span.style.setProperty("display", "inline-block")

  // span.style.setProperty("will-change", "transform")
  return span
}

function fullStaggerDuration(count, singleDuration) {
  if (count === 0) return 0
  // return 2 * singleDuration * (1 - 1 / (1 + count))
  return 1.5 * singleDuration - 1 / (1 + count)
}

function staggerDelay(i, n, duration, singleDuration) {
  if (i === 0) return 0
  const max = duration - singleDuration

  return (i / (n - 1)) * max
}
