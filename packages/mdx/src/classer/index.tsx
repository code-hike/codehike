import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react"

export { ClasserProvider, useClasser }
export type { Classes }

type AppClassName = string
type LibClassName = string
type Classes = Record<LibClassName, AppClassName>

const ClasserContext = createContext<Classes>({})

interface ClasserProviderProps {
  classes: Classes | undefined
  children?: React.ReactNode
}

function ClasserProvider({
  classes,
  children,
}: ClasserProviderProps) {
  const outer = useContext(ClasserContext)
  const mixed = useMerge(outer, classes)
  return (
    <ClasserContext.Provider
      value={mixed}
      children={children}
    />
  )
}

function useClasser(
  libClassPrefix: string,
  innerClasses?: Classes
) {
  const outerClasses = useContext(ClasserContext)
  const classes = useMerge(outerClasses, innerClasses)
  return useCallback(getClasser(libClassPrefix, classes), [
    libClassPrefix,
    classes,
  ])
}

function getClasser(
  libClassPrefix: string,
  classes: Classes
) {
  return function classer(...libClassSuffixList: string[]) {
    const libClassList = libClassSuffixList.map(
      libClassSuffix =>
        libClassPrefix +
        (libClassPrefix && libClassSuffix ? "-" : "") +
        libClassSuffix
    )
    const outputList = libClassList.slice()
    libClassList.forEach(libClass => {
      if (libClass in classes) {
        outputList.push(classes[libClass])
      }
    })
    return outputList.join(" ")
  }
}

function useMerge(
  outer: Classes | undefined,
  inner: Classes | undefined
) {
  return useMemo(
    () => ({ ...outer, ...inner }),
    [outer, inner]
  )
}
