"use client"
import React from "react"
import { ObservedDiv, Scroller } from "./utils/scroller.js"

const StepsContext = React.createContext<{
  selectedIndex: number
  selectIndex: React.Dispatch<React.SetStateAction<number>>
}>({
  selectedIndex: 0,
  selectIndex: () => {},
})

export function SelectionProvider({
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  throw new Error(
    "<SelectionProvider/> moved from 'codehike/utils' to 'codehike/utils/selection'",
  )
  const [selectedIndex, selectIndex] = React.useState<number>(0)
  return (
    <div data-selected-index={selectedIndex} {...rest}>
      <Scroller onIndexChange={selectIndex}>
        <StepsContext.Provider
          value={{
            selectedIndex,
            selectIndex,
          }}
        >
          {children}
        </StepsContext.Provider>
      </Scroller>
    </div>
  )
}

export function Selectable({
  index,
  selectOn = ["click"],
  ...rest
}: {
  index: number
  selectOn?: ("click" | "hover" | "scroll")[]
} & React.HTMLAttributes<HTMLDivElement>) {
  throw new Error(
    "<Selectable/> moved from 'codehike/utils' to 'codehike/utils/selection'",
  )
  const { selectedIndex, selectIndex } = React.useContext(StepsContext)
  const eventHandlers = React.useMemo(() => {
    const handlers: Record<string, () => void> = {}
    if (selectOn.includes("click")) {
      handlers.onClick = () => selectIndex(index)
    }
    if (selectOn.includes("hover")) {
      handlers.onMouseEnter = () => selectIndex(index)
    }
    return handlers
  }, [index, selectIndex, selectOn])

  const props = {
    "data-selected": selectedIndex === index,
    ...eventHandlers,
    ...rest,
  }

  return selectOn.includes("scroll") ? (
    <ObservedDiv index={index} {...props} />
  ) : (
    <div {...props} />
  )
}

export function Selection({ from }: { from: React.ReactNode[] }) {
  throw new Error(
    "<Selection/> moved from 'codehike/utils' to 'codehike/utils/selection'",
  )
  const { selectedIndex } = React.useContext(StepsContext)
  return from[selectedIndex]
}

export function useStepIndex() {
  const { selectedIndex, selectIndex } = React.useContext(StepsContext)
  return [selectedIndex, selectIndex] as const
}

export {
  StaticFallback,
  StaticToggle,
  useStaticToggle,
} from "./utils/static-fallback.js"
