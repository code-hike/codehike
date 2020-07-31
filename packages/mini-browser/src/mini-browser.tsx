import React from "react";
import { Back, Forward, Open } from "./buttons";
import { MiniFrame, FrameButtons } from "@code-hike/mini-frame";
import "./mini-browser.css";

type MiniBrowserStep = {
  url?: string;
  children: React.ReactNode;
  zoom?: number;
};

type MiniBrowserProps = {
  progress?: number;
  backward?: boolean;
  url?: string;
  children: React.ReactNode;
  zoom?: number;
  steps?: MiniBrowserStep[];
} & React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

function MiniBrowser({
  url = "",
  children,
  progress = 0,
  backward = false,
  zoom = 1,
  steps: ogSteps,
  ...props
}: MiniBrowserProps) {
  const steps = useSteps(ogSteps, { url, children, zoom });
  const stepIndex = backward
    ? Math.floor(progress)
    : Math.ceil(progress);
  const currentStep = steps[stepIndex];
  return (
    <MiniFrame
      {...props}
      zoom={currentStep.zoom}
      className={`ch-mini-browser ${props.className || ""}`}
      titleBar={<Bar url={currentStep.url!} />}
    >
      {currentStep.children || (
        <iframe
          src={currentStep.url}
          // sandbox={sandbox}
        />
      )}
    </MiniFrame>
  );
}

function useSteps(
  ogSteps: MiniBrowserStep[] | undefined,
  { zoom, url, children }: MiniBrowserStep
) {
  return React.useMemo(() => {
    if (!ogSteps) {
      return [{ zoom, url, children }];
    } else {
      return ogSteps.map((s) => ({ zoom, url, children, ...s }));
    }
  }, [ogSteps, zoom, url, children]);
}

function Bar({ url }: { url: string }) {
  return (
    <>
      <FrameButtons />
      <Back />
      <Forward />
      {/* <Refresh /> */}
      <input value={url} readOnly />
      <Open href={url} />
    </>
  );
}

export { MiniBrowser };
