import React from "react";
import { MiniTerminalTransitions } from "./mini-terminal-transitions";

export { MiniTerminal };

type MiniTerminalProps = {
  text?: string;
  title?: string;
  progress?: number;
  backward?: boolean;
  steps?: [{ text: string }];
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

function MiniTerminal({
  text,
  title = "bash",
  progress = 0,
  backward = false,
  steps,
  ...rest
}: MiniTerminalProps) {
  const actualSteps = steps || [{ text: text || "" }];

  return (
    <MiniTerminalTransitions
      steps={actualSteps}
      progress={progress}
      backward={backward}
      title={title}
      {...rest}
    />
  );
}
