import React from 'react';
import { MiniTerminalTransition } from './mini-terminal-transition';

function MiniTerminalTransitions({
  height = 100,
  title = 'bash',
  steps,
  progress,
}: {
  height?: number;
  title?: string;
  steps: string[];
  progress: number;
}) {
  const stepProgress = progress % 1;
  const prevIndex = clamp(Math.floor(progress), 0, steps.length - 1);
  const nextIndex = prevIndex + 1;
  return (
    <MiniTerminalTransition
      height={height}
      title={title}
      prev={steps[prevIndex]}
      prevKey={prevIndex}
      next={steps[nextIndex] || ''}
      nextKey={nextIndex}
      progress={stepProgress}
    />
  );
}

function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

export { MiniTerminalTransitions };
