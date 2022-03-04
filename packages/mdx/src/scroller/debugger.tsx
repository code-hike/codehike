export function debugEntries(
  entries: IntersectionObserverEntry[]
) {
  entries.forEach(showEntry)
}

function showEntry(entry: IntersectionObserverEntry) {
  const rootHeight = entry.rootBounds?.height || 0

  addFlashingRect(entry.rootBounds!, {
    border: `${Math.min(10, rootHeight / 2)}px solid ${
      iodOptions.rootColor
    }`,
    overflow: "hidden",
    boxSizing: "border-box",
  })

  addFlashingRect(entry.boundingClientRect, {
    border: `${Math.min(
      10,
      entry.boundingClientRect.height / 2
    )}px solid ${
      entry.isIntersecting
        ? iodOptions.enterColor
        : iodOptions.exitColor
    }`,
    overflow: "hidden",
    boxSizing: "border-box",
  })

  addFlashingRect(entry.intersectionRect, {
    backgroundColor: iodOptions.interColor,
    zIndex: 2,
  })
}

function addFlashingRect(
  bounds: DOMRectReadOnly,
  style = {}
) {
  const { width, left, height, top } = bounds
  const div = document.createElement("div")
  div.style.position = "fixed"
  div.style.width = width + "px"
  div.style.left = left + "px"
  div.style.top = top + "px"
  div.style.height = height + "px"
  div.style.pointerEvents = "none"
  div.style.transition = "opacity 2s ease-in"
  Object.assign(div.style, style)
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      div.style.opacity = "0"
    })
  )
  div.addEventListener("transitionend", () => {
    document.body.removeChild(div)
  })
  document.body.appendChild(div)
  return div
}

const iodOptions = {
  rootColor: "#9428AB",
  enterColor: "#B35C00",
  exitColor: "#035570",
  interColor: "#9CAF00BB",
}
