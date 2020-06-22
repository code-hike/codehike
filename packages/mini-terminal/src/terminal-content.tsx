import React from "react";
import { getCommands } from "./commands";

const prompt = <span style={{ color: "#8FA2DB", userSelect: "none" }}>$</span>;

function TerminalContent({
  text,
  progress = 1,
  style,
}: {
  text: string;
  progress?: number;
  style?: React.CSSProperties;
}) {
  const commands = parse(text, progress);
  return (
    <pre style={{ margin: 0, ...style }}>
      {commands.map(({ run, output }, i) => (
        <React.Fragment key={i}>
          <div>
            {prompt} <span>{run}</span>
          </div>
          {output && <div style={{ opacity: 0.66 }}>{output}</div>}
        </React.Fragment>
      ))}
    </pre>
  );
}

function parse(text: string, progress: number) {
  if (!text) return [];
  const chars = Math.round(text.length * progress);
  const { commands } = getCommands(text.slice(0, chars));
  return commands;
}

export { TerminalContent };
