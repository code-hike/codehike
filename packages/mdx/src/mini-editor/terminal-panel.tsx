import { InnerTerminal } from "../mini-terminal"
import React from "react"

type TerminalPanelProps = {
  prev: string | undefined
  next: string | undefined
  t: number
  backward: boolean
}

export function TerminalPanel({
  prev,
  next,
  t,
  backward,
}: TerminalPanelProps) {
  const height = getHeight({ prev, next, t, backward })
  return !height ? null : (
    <div className="ch-editor-terminal" style={{ height }}>
      <div className="ch-editor-terminal-tab">
        <span>Terminal</span>
      </div>
      <div className="ch-editor-terminal-content">
        <InnerTerminal
          steps={[
            { text: prev || "" },
            { text: next || "" },
          ]}
          progress={t}
        />
        )
      </div>
    </div>
  )
}

function getHeight({
  prev,
  next,
  t,
  backward,
}: TerminalPanelProps) {
  if (!prev && !next) return 0
  if (!prev && next) return MAX_HEIGHT * Math.min(t * 4, 1)
  if (prev && !next)
    return MAX_HEIGHT * Math.max(1 - t * 4, 0)
  return MAX_HEIGHT
}

const MAX_HEIGHT = 150
function getTerminalHeight(steps: any, progress: number) {
  if (!steps.length) {
    return 0
  }

  const prevIndex = Math.floor(progress)
  const nextIndex = Math.ceil(progress)
  const prevTerminal =
    steps[prevIndex] && steps[prevIndex].terminal
  const nextTerminal = steps[nextIndex].terminal

  if (!prevTerminal && !nextTerminal) return 0

  if (!prevTerminal && nextTerminal)
    return MAX_HEIGHT * Math.min((progress % 1) * 4, 1)
  if (prevTerminal && !nextTerminal)
    return MAX_HEIGHT * Math.max(1 - (progress % 1) * 4, 0)

  return MAX_HEIGHT
}
