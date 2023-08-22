const config = {
  removeDuration: 100,
  moveDuration: 300,
  addDuration: 300,
}

export function animate(
  elements,
  firstSnapshot,
  lastSnapshot
) {
  const groups = {
    removed: [],
    moved: [],
    forwards: [],
    backwards: [],
    added: [],
  }

  let previousKind = null
  elements.forEach(el => {
    const id = el.getAttribute("ch-x")
    const first = firstSnapshot[id]
    const last = lastSnapshot[id]

    const kind = classify(first, last)
    if (!kind) {
      // untouched
      previousKind = null
      return
    }

    // todo don't group "moves" when translate is different
    if (previousKind !== kind) {
      previousKind = kind
      groups[kind].push([])
    }

    groups[kind][groups[kind].length - 1].push(el)
  })

  // sort moved, first bwd moves, then fwd moves (inverted)
  groups.forwards.reverse()
  groups.moved = [...groups.backwards, ...groups.forwards]

  const removeDuration = fullStaggerDuration(
    groups.removed.length,
    config.removeDuration
  )
  const moveDuration = fullStaggerDuration(
    groups.moved.length,
    config.moveDuration
  )
  const addDuration = fullStaggerDuration(
    groups.added.length,
    config.addDuration
  )

  groups.removed.forEach((group, groupIndex) => {
    group.forEach(el => {
      const id = el.getAttribute("ch-x")
      const first = firstSnapshot[id]
      const last = lastSnapshot[id]
      const delay = staggerDelay(
        groupIndex,
        groups.removed.length,
        removeDuration,
        config.removeDuration
      )
      animateRemove(el, first, last, delay)
    })
  })

  // todo group by backwards and forwards
  groups.moved.forEach((group, groupIndex) => {
    group.forEach(el => {
      const id = el.getAttribute("ch-x")
      const first = firstSnapshot[id]
      const last = lastSnapshot[id]
      const delay =
        removeDuration +
        staggerDelay(
          groupIndex,
          groups.moved.length,
          moveDuration,
          config.moveDuration
        )

      animateMove(el, first, last, delay)
    })
  })

  groups.added.forEach((group, groupIndex) => {
    group.forEach(el => {
      const id = el.getAttribute("ch-x")
      const first = firstSnapshot[id]
      const last = lastSnapshot[id]
      const delay =
        removeDuration +
        moveDuration +
        staggerDelay(
          groupIndex,
          groups.added.length,
          addDuration,
          config.addDuration
        )

      animateAdd(el, first, last, delay)
    })
  })
}

function animateRemove(element, first, last, delay) {
  const dx = first.x - last.x
  const dy = first.y - last.y
  element.animate(
    {
      opacity: [1, 0],
      transform: [
        `translate(${dx}px, ${dy}px)`,
        `translate(${dx}px, ${dy}px)`,
      ],
    },
    {
      // todo maybe use removeDuration from fullStaggerDuration
      duration: config.removeDuration,
      easing: "ease-out",
      fill: "both",
      delay,
    }
  )
}

function animateMove(element, first, last, delay) {
  const dx = first.x - last.x
  const dy = first.y - last.y
  element.animate(
    {
      opacity: [first.opacity, last.opacity],
      transform: [
        `translate(${dx}px, ${dy}px)`,
        "translate(0, 0)",
      ],
      color: [first.color, last.color],
    },
    {
      duration: config.moveDuration,
      easing: "ease-in-out",
      fill: "both",
      delay,
    }
  )
}

function animateAdd(element, first, last, delay) {
  element.animate(
    { opacity: [0, 1] },
    {
      duration: config.addDuration,
      fill: "both",
      easing: "ease-out",
      delay,
    }
  )
}

function classify(first, last) {
  if (
    first &&
    first.x === last.x &&
    first.y === last.y &&
    first.opacity === last.opacity
    // todo add color?
  ) {
    // unchanged
    return null
  }

  // todo shouldn't use opacity for this
  if (last.opacity < 0.5) {
    return "removed"
  }

  // todo shouldn't use opacity for this
  if (!first || first.opacity < 0.5) {
    return "added"
  }

  const dx = first.x - last.x
  const dy = first.y - last.y

  const bwd = dy > 0 || (dy == 0 && dx > 0)

  return bwd ? "backwards" : "forwards"
}

function fullStaggerDuration(count, singleDuration) {
  if (count === 0) return 0
  return 2 * singleDuration * (1 - 1 / (1 + count))
  // return 1.5 * singleDuration - 1 / (1 + count)
}

function staggerDelay(i, n, duration, singleDuration) {
  if (i === 0) return 0
  const max = duration - singleDuration

  return (i / (n - 1)) * max
}
