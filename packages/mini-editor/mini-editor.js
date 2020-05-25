import React from "react";
import { EditorFrame } from "./editor-frame";
import { CodeSurfer } from "@code-surfer/standalone";
import { vsDark } from "@code-surfer/themes";

export { MiniEditor };

function MiniEditor({ progress, steps, height, backwards, style }) {
  const files = [...new Set(steps.map((s) => s.file).filter((f) => f != null))];

  const activeStepIndex = backwards
    ? Math.floor(progress)
    : Math.ceil(progress);
  const activeStep = steps[activeStepIndex];
  const activeFile = activeStep && activeStep.file;

  const fileSteps = {};
  steps.forEach((s) => {
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

  return (
    <EditorFrame
      files={activeStep.tabs || files}
      active={activeFile}
      height={height}
      link={activeStep.link}
      style={style}
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
