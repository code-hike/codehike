"use client"
import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

import React from "react"

const TabsContext = React.createContext<any>({
  selectedIndex: 0,
  setSelectedIndex: () => {},
  options: [],
})

export function TabsToggle({ children, className, options }: any) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  return (
    <TabsContext.Provider value={{ selectedIndex, setSelectedIndex, options }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className }: any) {
  const { selectedIndex, setSelectedIndex, options } =
    React.useContext(TabsContext)
  return (
    <ToggleGroup
      type="single"
      size="sm"
      className="ml-auto mr-4"
      onValueChange={(value) => {
        console.log(value)
        setSelectedIndex(Number(value))
      }}
      value={String(selectedIndex)}
    >
      {options.map((option: any, i: number) => (
        <ToggleGroupItem
          key={i}
          variant="tabs"
          value={String(i)}
          aria-label={`Toggle ${option.name}`}
        >
          {option.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function TabsContent({ className }: any) {
  const { selectedIndex, options } = React.useContext(TabsContext)
  const option = options[selectedIndex]
  return <div className={className}>{option.content}</div>
}
