type Easing = (t: number) => number

export type TweenParams =
  | { fixed: true; value: number }
  | {
      fixed: false
      extremes: [number, number]
      interval: [number, number]
      ease?: Easing
    }

export function tween(params: TweenParams, t: number) {
  // needs === true for typescript...
  if (params.fixed === true) {
    return params.value
  } else {
    const [start, end] = params.interval
    const [from, to] = params.extremes
    if (t < start) return from
    if (t > end) return to
    const x = (t - start) / (end - start)
    const ease = params.ease || easing.linear
    return from + ease(x) * (to - from)
  }
}

export function stagger(
  [start, end]: [number, number],
  index: number,
  count: number
): [number, number] {
  if (count <= 1) return [start, end]

  const totalDuration = end - start
  const stepDuration =
    totalDuration / Math.pow(count, 1 / 8)
  const tick = (totalDuration - stepDuration) / (count - 1)
  const stepStart = start + tick * index
  const stepEnd = stepStart + stepDuration
  return [stepStart, stepEnd]
}

export const easing = {
  linear: function (t: number) {
    return t
  },
  easeInQuad: function (t: number) {
    return t * t
  },
  easeOutQuad: function (t: number) {
    return t * (2 - t)
  },
  easeInOutCubic: function (t: number) {
    return t < 0.5
      ? 4 * t * t * t
      : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },
}
