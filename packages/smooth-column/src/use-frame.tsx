import React from "react"

export type Item = {
  height: number
  id: any
  element: React.ReactElement
}

export function useFrame(
  prevItems: Item[],
  nextItems: Item[],
  progress: number,
  padding: number
) {
  const getFrame = React.useMemo(
    () => getGetFrame(prevItems, nextItems, padding),
    [prevItems, nextItems, padding]
  )
  return getFrame(progress)
}

function getGetFrame(
  prevItems: Item[],
  nextItems: Item[],
  padding: number
) {
  const currentItems = prevItems.filter(
    prev =>
      prev.id != null &&
      nextItems.some(next => next.id === prev.id)
  )
  const exitItems = prevItems.filter(
    prev =>
      prev.id == null ||
      !nextItems.some(next => next.id === prev.id)
  )
  const enterItems = nextItems.filter(
    next =>
      next.id == null ||
      !prevItems.some(prev => prev.id === next.id)
  )

  const currentHeights = currentItems.map(
    item => item.height
  )
  const exitHeights = exitItems.map(item => item.height)
  const enterHeights = enterItems.map(item => item.height)

  const prevTops = translates(
    [...exitHeights, ...currentHeights],
    [],
    enterHeights,
    padding
  )
  const nextTops = translates(
    [...currentHeights, ...enterHeights],
    exitHeights,
    [],
    padding
  )

  const prevHeight =
    sum(prevItems.map(item => item.height)) +
    prevItems.length * padding -
    padding
  const nextHeight =
    sum(nextItems.map(item => item.height)) +
    nextItems.length * padding -
    padding

  const height = Math.min(prevHeight, nextHeight)

  const allItems = [
    ...exitItems,
    ...currentItems,
    ...enterItems,
  ]
  const state = [
    ...exitItems.map(() => "exit"),
    ...currentItems.map(() => "stay"),
    ...enterItems.map(() => "enter"),
  ]
  const heights = [
    ...exitItems.map(({ height }) => [height, height]),
    ...currentItems.map(({ id }) => [
      prevItems.find(item => item.id === id)!.height,
      nextItems.find(item => item.id === id)!.height,
    ]),
    ...enterItems.map(({ height }) => [height, height]),
  ]

  return (progress: number) => {
    return {
      height,
      frame: allItems.map((item, i) => ({
        item: item,
        itemHeight: tweenTranslate(
          heights[i][0],
          heights[i][1],
          progress
        ),
        translateY: tweenTranslate(
          prevTops[i],
          nextTops[i],
          progress
        ),
        opacity:
          state[i] === "stay"
            ? 1
            : state[i] === "exit"
            ? tweenOpacity(1 - progress)
            : tweenOpacity(progress),
      })),
    }
  }
}

function tweenOpacity(t: number) {
  return Math.pow(t, 4)
}

function tweenTranslate(p: number, n: number, t: number) {
  return (n - p) * t + p
}

function translates(
  current: number[],
  exit: number[],
  enter: number[],
  padding: number
) {
  const total =
    sum(current) + (current.length - 1) * padding
  const middle = total / 2
  let acc = -middle
  const currentTops = current.map(h => {
    const top = acc
    acc += h + padding
    return top
  })

  const exitTotal = sum(exit) + exit.length * padding
  acc = (currentTops[0] || -200) - exitTotal
  const exitTops = exit.map(h => {
    const top = acc * 1.4
    acc += h + padding
    return top
  })

  acc = (middle || 200) + padding
  const enterTops = enter.map(h => {
    const top = acc * 1.4
    acc += h + padding
    return top
  })

  return [...exitTops, ...currentTops, ...enterTops]
}

function sum(array: number[]) {
  return array.reduce((a, b) => a + b, 0)
}
