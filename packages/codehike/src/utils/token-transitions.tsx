import { diffArrays } from "diff"

type SnapshotElement = {
  x: number
  y: number
  color: string
  content: string | null
}

export type TokenTransitionsSnapshot = SnapshotElement[]

export type TokenTransition = {
  element: HTMLElement
  keyframes: {
    translateX?: [number, number]
    translateY?: [number, number]
    color?: [string, string]
    opacity?: [number, number]
  }
  options: {
    delay: number
    duration: number
    easing: string
    fill: "backwards" | "both"
  }
}

const config = {
  moveDuration: 0.28,
  addDuration: 0.22,
}
// max possible duration of the full transition is 1:
// 0.28 * 2 + 0.22 * 2 = 1 (because of `fullStaggerDuration`)

type Options = {
  selector?: string
}

export function getStartingSnapshot(
  parent: HTMLElement,
  options?: Options,
): TokenTransitionsSnapshot {
  const elements = getFlipableElements(parent, options?.selector)
  return elements.map(toSnapshotElement)
}

export function calculateTransitions(
  parent: HTMLElement,
  firstSnapshot: TokenTransitionsSnapshot,
  options?: Options,
) {
  const elements = getFlipableElements(parent, options?.selector)
  const flips = getFlips(elements, firstSnapshot)
  return flipsToTransitions(flips)
}

type Flip = {
  element: HTMLElement
  first: SnapshotElement | null
  last: SnapshotElement
}

function flipsToTransitions(flips: Flip[]) {
  const { added, moved } = groupFlips(flips)
  const removeDuration = 0
  const moveDuration = fullStaggerDuration(moved.length, config.moveDuration)

  const transitions = [] as TokenTransition[]

  moved.forEach((group, groupIndex) => {
    group.forEach((flip) => {
      const { first, last, element } = flip
      const delay =
        removeDuration +
        staggerDelay(
          groupIndex,
          moved.length,
          moveDuration,
          config.moveDuration,
        )

      transitions.push(toMoveTransition(element, first!, last, delay))
    })
  })

  const addedFlips = added.flat()
  const addDuration = fullStaggerDuration(addedFlips.length, config.addDuration)
  addedFlips.forEach((flip, index) => {
    const { first, last, element } = flip
    const delay =
      removeDuration +
      moveDuration +
      staggerDelay(index, addedFlips.length, addDuration, config.addDuration)

    transitions.push(toAddTransition(element, last, delay))
  })

  return transitions
}

function toMoveTransition(
  element: HTMLElement,
  first: SnapshotElement,
  last: SnapshotElement,
  delay: number,
): TokenTransition {
  const dx = first.x - last.x
  const dy = first.y - last.y

  return {
    element,
    keyframes: {
      // opacity: [first.opacity, last.opacity],
      translateX: [dx, 0],
      translateY: [dy, 0],
      color: [first.color, last.color],
    },
    options: {
      duration: config.moveDuration,
      easing: "ease-in-out",
      fill: "backwards",
      delay,
    },
  }
}

function toAddTransition(
  element: HTMLElement,
  last: SnapshotElement,
  delay: number,
): TokenTransition {
  return {
    element,
    keyframes: { opacity: [0, 1] },
    options: {
      duration: config.addDuration,
      fill: "both",
      easing: "ease-out",
      delay,
    },
  }
}

// ---

type Group = Flip[]

function groupFlips(flips: Flip[]): {
  added: Group[]
  moved: Group[]
} {
  const added: Group[] = []
  const forwards: Group[] = []
  const backwards: Group[] = []

  let lastBin: Group[] | null = null

  flips.forEach((flip) => {
    const { first, last } = flip
    let bin: Group[] | null = null

    if (!first) {
      bin = added
    } else if (first.x === last.x && first.y === last.y) {
      // unchanged
      bin = null
    } else {
      const dx = first.x - last.x
      const dy = first.y - last.y
      const bwd = dy > 0 || (dy == 0 && dx > 0)
      bin = bwd ? backwards : forwards
    }

    if (bin && bin !== lastBin) {
      bin.push([flip])
    } else if (bin) {
      bin[bin.length - 1].push(flip)
    }

    lastBin = bin
  })

  forwards.reverse()
  const moved = [...backwards, ...forwards]

  return { added, moved }
}

// ---

function fullStaggerDuration(count: number, singleDuration: number) {
  if (count === 0) return 0
  return 2 * singleDuration * (1 - 1 / (1 + count))
  // max possible duration is 2 * singleDuration
}
function staggerDelay(
  i: number,
  n: number,
  duration: number,
  singleDuration: number,
) {
  if (i === 0) return 0
  const max = duration - singleDuration
  return (i / (n - 1)) * max
}

// ---

export function getFlips(
  elements: HTMLElement[],
  firstSnapshot: SnapshotElement[],
) {
  const flips = elements.map((element) => ({
    element,
    first: null as SnapshotElement | null,
    last: toSnapshotElement(element),
  }))

  const firstContent = firstSnapshot.map((e) => e.content)
  const lastContent = flips.map((e) => e.last.content)
  diffList(firstContent, lastContent).forEach(([firstIndex, lastIndex]) => {
    flips[lastIndex].first = firstSnapshot[firstIndex]
  })
  return flips
}

function getFlipableElements(
  parent: HTMLElement,
  selector: string = ":not(:has(*))",
): HTMLElement[] {
  return Array.from(parent.querySelectorAll(selector))
}

function toSnapshotElement(el: HTMLElement): SnapshotElement {
  // const { x, y } = el.getBoundingClientRect()
  let x = 0
  let y = 0
  let p = el as any
  while (p) {
    x += p.offsetLeft
    y += p.offsetTop
    p = p.offsetParent
  }
  el?.getAnimations().forEach((a) => a.cancel())
  const style = window.getComputedStyle(el)
  const color = style.color
  const content = el.textContent

  return { x, y, color, content }
}

// Returns a list of [a, b], where a is the index of the item in the first array
// and b is the index of the item in the second array.
// only returns indices of items that are in both arrays.
export function diffList<T>(a: T[], b: T[]): [number, number][] {
  const result = diffArrays(a, b)
  const list: [number, number][] = []

  let ai = 0
  let bi = 0

  result.forEach(({ count, added, removed }) => {
    if (added) {
      bi += count!
    } else if (removed) {
      ai += count!
    } else {
      for (let i = 0; i < count!; i++) {
        list.push([ai++, bi++])
      }
    }
  })

  return list
}
