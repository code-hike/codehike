export { transparent } from "./color"
export * from "./tween"
export * from "./code"
export * from "./focus"
export * from "./hooks"

export function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max)
}
