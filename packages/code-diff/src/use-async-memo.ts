import React from "react"

type AsyncMemoOptions<T> = {
  loader: () => Promise<T>
  placeholder: () => T
}

export function useAsyncMemo<T>(
  { loader, placeholder }: AsyncMemoOptions<T>,
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
    loader().then(result => {
      setState(({ version }) => ({
        result,
        deps,
        version: version + 1,
      }))
    })
  }, deps)

  return React.useMemo(() => {
    if (depsChanged(deps, lastLoadedDeps)) {
      return placeholder()
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