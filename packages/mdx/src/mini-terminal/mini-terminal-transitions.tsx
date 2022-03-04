import React from "react";
import {
  MiniTerminalTransition,
  InnerTerminalTransition,
} from "./mini-terminal-transition";

function MiniTerminalTransitions({
  title = "bash",
  steps,
  progress,
  backward,
  ...rest
}: {
  height?: number;
  title?: string;
  steps: { text: string }[];
  progress: number;
  backward: boolean;
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>) {
  const textSteps = steps.map((s) => s.text);
  const stepProgress = progress % 1;
  const prevIndex = clamp(Math.floor(progress), 0, textSteps.length - 1);
  const nextIndex = prevIndex + 1;
  return (
    <MiniTerminalTransition
      title={title}
      prev={textSteps[prevIndex]}
      prevKey={prevIndex}
      next={textSteps[nextIndex] || ""}
      nextKey={nextIndex}
      progress={stepProgress}
      {...rest}
    />
  );
}

function InnerTerminalTransitions({
  steps,
  progress,
}: {
  steps: { text: string }[];
  progress: number;
}) {
  const textSteps = steps.map((s) => s.text);
  const stepProgress = progress % 1;
  const prevIndex = clamp(Math.floor(progress), 0, steps.length - 1);
  const nextIndex = prevIndex + 1;
  return (
    <InnerTerminalTransition
      prev={textSteps[prevIndex]}
      prevKey={prevIndex}
      next={textSteps[nextIndex] || ""}
      nextKey={nextIndex}
      progress={stepProgress}
    />
  );
}

function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

export { MiniTerminalTransitions, InnerTerminalTransitions };
