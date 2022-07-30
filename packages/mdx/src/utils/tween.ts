export type Tween<T> =
  | { prev?: T; next: T }
  | { prev: T; next?: T }

export type FullTween<T> = { prev: T; next: T }

type AnyTween<T> = Tween<T> | FullTween<T>

function map<T, R>(
  tween: FullTween<T>,
  fn: (t: T, key: "prev" | "next") => R
): FullTween<R>
function map<T, R>(
  tween: Tween<T>,
  fn: (t: T | undefined, key: "prev" | "next") => R
): Tween<R>
function map<T, R>(
  tween: AnyTween<T>,
  fn: (t: T | undefined, key: "prev" | "next") => R
): AnyTween<R> {
  return {
    prev: fn(tween.prev, "prev"),
    next: fn(tween.next, "next"),
  }
}

export { map }

export function withDefault<T>(
  t: Tween<T> | undefined,
  deft: T
): FullTween<T> {
  return {
    prev: t?.prev === undefined ? deft : t.prev,
    next: t?.next === undefined ? deft : t.next,
  }
}

export function mapWithDefault<T, R>(
  tween: Tween<T> | undefined,
  deft: T,
  fn: (t: T, key: "prev" | "next") => R
): FullTween<R> {
  return map(withDefault(tween, deft), fn)
}

export function anyValue<T, R>(
  tween: AnyTween<T>,
  fn: (t: T) => R
): R {
  return fn(tween.prev) || fn(tween.next)
}
