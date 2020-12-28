import React from "react"
import { getCommands } from "./commands"

const prompt = <span className="ch-terminal-prompt">$</span>

function TerminalContent({
  text,
  progress = 1,
  style,
}: {
  text: string
  progress?: number
  style?: React.CSSProperties
}) {
  const commands = parse(text, progress)
  return (
    <pre style={style} className="ch-terminal-content">
      {commands.map(({ run, output }, i) => (
        <React.Fragment key={i}>
          <div>
            {prompt} <span>{run}</span>
          </div>
          {output && (
            <div className="ch-terminal-output">
              {output}
            </div>
          )}
        </React.Fragment>
      ))}
    </pre>
  )
}

function parse(text: string, progress: number) {
  if (!text) return []
  const chars = Math.round(text.length * progress)
  const { commands } = getCommands(text.slice(0, chars))
  return commands
}

export { TerminalContent }
