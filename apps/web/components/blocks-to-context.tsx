"use client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import React from "react"

const BlocksContext = React.createContext<any>(null)

export function BlocksToContext({
  children,
  ...rest
}: {
  children: React.ReactNode
  rest: any
}) {
  return (
    <BlocksContext.Provider value={rest}>{children}</BlocksContext.Provider>
  )
}

export function useBlocksContext(name: string) {
  return React.useContext(BlocksContext)[name]
}

export function WithTooltip({
  children,
  name,
}: {
  children: React.ReactNode
  name: string
}) {
  const block = useBlocksContext(name)
  const className = block.isCode
    ? "p-0 [&>*]:my-0 border-none overflow-auto rounded-none"
    : ""
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted underline-offset-4 cursor-help">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className={className}>{block?.children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
