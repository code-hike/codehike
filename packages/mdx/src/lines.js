const EXIT_DURATION = 0.5

export function setLines(parent, lines) {
  const oldLineElements = Array.from(parent.children)

  const measureOld = measureProperties(oldLineElements)

  setFinalScene(parent, oldLineElements, lines, measureOld)

  const newLineElements = Array.from(parent.children)

  const measureNew = measureProperties(newLineElements)

  fillAnimationStart(measureOld, measureNew)
}

function fillAnimationStart(measureOld, measureNew) {
  const exits = []
  const enters = []
  const moves = []

  measureNew.forEach((mNew, element) => {
    if (mNew.transform !== "none") {
      exits.push(element)
    } else if (measureOld.has(element)) {
      moves.push(element)
    } else {
      enters.push(element)
    }
  })

  const exitCounts = exits.length
  const exitsDuration = fullStaggerDuration(exitCounts)

  exits.forEach((element, i) => {
    const mNew = measureNew.get(element)
    const mOld = measureOld.get(element)

    const dx = mOld.x - mNew.x
    const dy = mOld.y - mNew.y

    element.style.setProperty("--opacity", mOld.opacity)
    element.style.setProperty(
      "--transform",
      `${mNew.transform} translateX(${dx}px) translateY(${dy}px)`
    )
    element.style.setProperty("animation-name", "x")
    element.style.setProperty(
      "animation-delay",
      `${staggerDelay(i, exitCounts, exitsDuration)}s`
    )
  })

  moves.forEach(element => {
    const mNew = measureNew.get(element)
    const mOld = measureOld.get(element)

    const dx = mOld.x - mNew.x
    const dy = mOld.y - mNew.y

    element.style.setProperty("--opacity", mOld.opacity)
    element.style.setProperty(
      "--transform",
      `translateX(${dx}px) translateY(${dy}px)`
    )
    element.style.setProperty("animation-name", "x")
    element.style.setProperty(
      "animation-delay",
      `${exitsDuration}s`
    )
  })

  const enterStart =
    exitsDuration + (moves.length > 0 ? EXIT_DURATION : 0)
  const enterCounts = enters.length
  const entersDuration = fullStaggerDuration(enterCounts)

  enters.forEach((element, i) => {
    const delay =
      enterStart +
      staggerDelay(i, enterCounts, entersDuration)
    console.log({
      enterStart,
      enterCounts,
      entersDuration,
      delay,
    })
    element.style.setProperty("--opacity", "0.1")
    element.style.setProperty(
      "--transform",
      "translateX(100%)"
    )
    element.style.setProperty("animation-name", "x")
    element.style.setProperty(
      "animation-delay",
      `${delay}s`
    )
  })
}

function measureProperties(oldLineElements) {
  const measures = new Map()
  for (const line of oldLineElements) {
    const id = line.getAttribute("data-ch-lid")
    const style = window.getComputedStyle(line)
    const rect = line.getBoundingClientRect()
    measures.set(line, {
      id,
      opacity: style.opacity,
      transform: style.transform,
      animationName: style.animationName,
      y: rect.y,
      x: rect.x,
    })
  }
  return measures
}

function setFinalScene(
  parent,
  lineElements,
  lines,
  measureOld
) {
  let oldIndex = 0
  let newIndex = 0

  const oldIds = [...measureOld.values()].map(m => m.id)
  const newIds = lines.map(line => line.id)

  const toBeRemoved = []

  while (
    oldIndex < lineElements.length ||
    newIndex < lines.length
  ) {
    const oldElement = lineElements[oldIndex]
    const newLine = lines[newIndex]
    const m = measureOld.get(oldElement)
    const oldId = m?.id
    const newId = newLine?.id

    if (newId && !oldIds.includes(newId)) {
      addLine(parent, newLine, oldElement)
      newIndex++
      continue
    }

    oldElement.style.setProperty("animation-name", "none")

    // TODO change opacity to 0
    if (!oldId && m.opacity === "0.1") {
      oldElement.remove()
      oldIndex++
      continue
    }

    if (!newIds.includes(oldId)) {
      prepareToRemoveLine(oldElement)
      toBeRemoved.push(oldElement)
      oldIndex++
      continue
    }

    oldIndex++
    newIndex++
  }

  // now that we have all the lines, we need to find the transformY for the absolute positioned lines
  const dys = toBeRemoved.map(element => {
    const oldY = measureOld.get(element).y
    const newY = element.getBoundingClientRect().y
    return oldY - newY
  })

  toBeRemoved.forEach((element, i) => {
    const dy = dys[i]
    element.style.setProperty(
      "transform",
      `translateX(-100%) translateY(${dy}px)`
    )
  })
}

function addLine(parent, newLine, oldElement) {
  const newElement = document.createElement("div")
  newElement.classList.add("line")
  newElement.setAttribute("data-ch-lid", newLine.id)
  newElement.textContent = newLine.content
  parent.insertBefore(newElement, oldElement)
}

function prepareToRemoveLine(oldElement) {
  // TODO change opacity to 0
  oldElement.style.setProperty("opacity", "0.1")
  oldElement.style.setProperty("position", "absolute")
  oldElement.dataset.chLid = ""
}

function fullStaggerDuration(count) {
  if (count === 0) return 0
  return 2 * EXIT_DURATION * (1 - 1 / (1 + count))
}

function staggerDelay(i, n, duration) {
  if (i === 0) return 0
  const max = duration - EXIT_DURATION
  console.log({ i, n, max })
  return (i / (n - 1)) * max
}
