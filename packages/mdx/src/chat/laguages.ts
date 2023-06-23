import { preload } from "@code-hike/lighter/dist/browser.esm.mjs"

const cache = new Map<
  string,
  { promise: Promise<boolean>; loaded: boolean }
>()

export function getLoadedLanguages() {
  return Array.from(cache.entries())
    .filter(([, { loaded }]) => loaded)
    .map(([lang]) => lang)
}

export function isLangLoaded(lang: string) {
  // if is server side return false
  if (typeof window === "undefined") {
    return false
  }

  return cache.get(lang)?.loaded
}

export async function loadLang(lang: string) {
  // TODO what happens if the lang is not supported?
  if (cache.has(lang)) {
    return cache.get(lang)!.promise
  }

  const promise = preload([lang])
  cache.set(lang, { promise, loaded: false })
  await promise
  cache.set(lang, { promise, loaded: true })
  return promise
}
