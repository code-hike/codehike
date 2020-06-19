import React from "react";
import { EditorFrame } from "./editor-frame";
import { CodeSurfer } from "@code-surfer/standalone";
import { vsDark } from "@code-surfer/themes";

export { MiniEditor };

function MiniEditor({ progress, steps, height, backwards, style }: any) {
  const files = [
    ...new Set(steps.map((s: any) => s.file).filter((f: any) => f != null)),
  ];

  const activeStepIndex = backwards
    ? Math.floor(progress)
    : Math.ceil(progress);
  const activeStep = steps[activeStepIndex];
  const activeFile = activeStep && activeStep.file;

  const fileSteps: any = {};
  steps.forEach((s: any) => {
    if (s.file == null) return;
    if (!fileSteps[s.file]) {
      fileSteps[s.file] = [];
    }
    fileSteps[s.file].push(s);
  });

  const activeSteps = fileSteps[activeFile] || [];
  const index = activeSteps.indexOf(activeStep);
  const activeProgress = Math.min(
    Math.max(progress - activeStepIndex + index, 0),
    activeSteps.length - 1
  );

  const terminalHeight = getTerminalHeight(steps, progress);

  return (
    <EditorFrame
      files={activeStep.tabs || files}
      active={activeFile}
      terminal={activeStep.terminal}
      terminalHeight={terminalHeight}
      height={height}
      link={activeStep.link}
      style={style}
      progress={activeProgress}
    >
      {activeSteps.length > 0 && (
        <CodeSurfer
          key={activeFile}
          progress={activeProgress}
          steps={activeSteps}
          theme={vsDark}
          nonblocking={true}
        />
      )}
    </EditorFrame>
  );
}

const MAX_HEIGHT = 150;
function getTerminalHeight(steps: any, progress: number) {
  const prevIndex = Math.floor(progress);
  const nextIndex = Math.ceil(progress);
  const prevTerminal = steps[prevIndex] && steps[prevIndex].terminal;
  const nextTerminal = steps[nextIndex].terminal;

  if (!prevTerminal && !nextTerminal) return 0;

  if (!prevTerminal && nextTerminal)
    return MAX_HEIGHT * Math.min((progress % 1) * 4, 1);
  if (prevTerminal && !nextTerminal)
    return MAX_HEIGHT * Math.max(1 - (progress % 1) * 4, 0);

  return MAX_HEIGHT;
}
