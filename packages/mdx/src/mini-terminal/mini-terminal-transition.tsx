import React from "react"
import { TerminalContent } from "./terminal-content"
import { MiniFrame } from "../mini-frame"

function MiniTerminalTransition({
  title = "bash",
  prev,
  prevKey,
  next,
  nextKey,
  progress,
  className = "",
  ...rest
}: {
  title?: string
  prev: string
  prevKey?: React.Key
  next: string
  nextKey?: React.Key
  progress: number
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>) {
  return (
    <MiniFrame
      title={title}
      {...rest}
      className={"ch-terminal-container " + className}
    >
      <InnerTerminalTransition
        {...{ prev, prevKey, next, nextKey, progress }}
      />
    </MiniFrame>
  )
}

function InnerTerminalTransition({
  prev = "",
  prevKey,
  next = "",
  nextKey,
  progress,
}: {
  prev: string
  prevKey?: React.Key
  next: string
  nextKey?: React.Key
  progress: number
}) {
  return (
    <div className="ch-terminal">
      <div
        style={{
          position: "relative",
          transform: `translateY(-${progress * 100}%)`,
        }}
      >
        <TerminalContent
          text={prev}
          progress={1}
          key={prevKey}
        />
        <TerminalContent
          style={{ position: "absolute" }}
          text={next}
          progress={progress}
          key={nextKey}
        />
      </div>
    </div>
  )
}

export { MiniTerminalTransition, InnerTerminalTransition }
