import React from "react"

type AsyncMemoOptions<T> = {
  isReady: boolean
  load: () => Promise<void>
  run: () => T
  placeholder: () => T
}

export function useAsyncMemo<T>(
  { isReady, load, run, placeholder }: AsyncMemoOptions<T>,
  deps?: React.DependencyList
): T {
  const [
    {
      result: lastLoadedResult,
      deps: lastLoadedDeps,
      version,
    },
    setState,
  ] = React.useState<{
    result: T | null
    deps: React.DependencyList | undefined
    version: number
  }>({ result: null, deps: [], version: 0 })

  React.useEffect(() => {
    if (!isReady) {
      load().then(() => {
        setState(({ version }) => ({
          result: run(),
          deps,
          version: version + 1,
        }))
      })
    }
  }, deps)

  return React.useMemo(() => {
    if (depsChanged(deps, lastLoadedDeps)) {
      return isReady ? run() : placeholder()
    } else {
      return lastLoadedResult as T
    }
  }, [version, ...deps])
}

function depsChanged(
  oldDeps: React.DependencyList | undefined,
  newDeps: React.DependencyList | undefined
) {
  if (oldDeps === newDeps) return false
  if (!oldDeps || !newDeps) return true
  return oldDeps?.some(
    (dep, index) => newDeps[index] !== dep
  )
}
