import React from "react";
import { EditorFrame, TerminalPanel } from "./editor-frame";
import { CodeSurfer } from "@code-surfer/standalone";
import { vsDark } from "@code-surfer/themes";
import { InnerTerminal } from "@code-hike/mini-terminal";

export { MiniEditor };

type MiniEditorStep = {
  code?: string;
  focus?: string;
  lang?: string;
  file?: string;
  tabs?: string[];
  terminal?: string;
};

type MiniEditorProps = {
  progress?: number;
  backward?: boolean;
  code?: string;
  focus?: string;
  lang?: string;
  file?: string;
  steps?: MiniEditorStep[];
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

function MiniEditor({
  progress = 0,
  backward = false,
  code,
  focus,
  lang,
  file,
  steps: ogSteps,
  ...rest
}: MiniEditorProps) {
  const { steps, files, stepsByFile } = useSteps(ogSteps, {
    code,
    focus,
    lang,
    file,
  });

  const activeStepIndex = backward ? Math.floor(progress) : Math.ceil(progress);
  const activeStep = steps[activeStepIndex];
  const activeFile = (activeStep && activeStep.file) || "";

  const activeSteps = stepsByFile[activeFile] || [];
  const index = activeSteps.indexOf(activeStep);
  const activeProgress = Math.min(
    Math.max(progress - activeStepIndex + index, 0),
    activeSteps.length - 1
  );
  const tabs = activeStep.tabs || files;

  const terminalHeight = getTerminalHeight(steps, progress);

  const terminalSteps = steps.map((s) => ({ text: (s && s.terminal) || "" }));
  return (
    <EditorFrame
      files={tabs}
      active={activeFile}
      terminalPanel={
        <TerminalPanel height={terminalHeight}>
          <InnerTerminal steps={terminalSteps} progress={progress} />
        </TerminalPanel>
      }
      {...rest}
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

function useSteps(
  ogSteps: MiniEditorStep[] | undefined,
  { code = "", focus, lang, file }: MiniEditorStep
) {
  return React.useMemo(() => {
    const steps = ogSteps?.map((s) => ({
      code,
      focus,
      lang,
      file,
      ...s,
    })) || [{ code, focus, lang, file }];

    const files = [
      ...new Set(steps.map((s: any) => s.file).filter((f: any) => f != null)),
    ];

    const stepsByFile: Record<string, MiniEditorStep[]> = {};
    steps.forEach((s) => {
      if (s.file == null) return;
      if (!stepsByFile[s.file]) {
        stepsByFile[s.file] = [];
      }
      stepsByFile[s.file].push(s);
    });

    return { steps, files, stepsByFile };
  }, [ogSteps, code, focus, lang, file]);
}

const MAX_HEIGHT = 150;
function getTerminalHeight(steps: any, progress: number) {
  if (!steps.length) {
    return 0;
  }

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
