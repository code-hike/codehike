export type TweenParams =
  | { fixed: true; value: number }
  | {
      fixed: false
      extremes: [number, number]
      interval: [number, number]
    }

export function tween(params: TweenParams, t: number) {
  if (params.fixed) return params.value
  const [start, end] = params.interval
  const [from, to] = params.extremes
  if (t < start) return from
  if (t > end) return to
  const x = (t - start) / (end - start)
  return from + x * (to - from)
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
