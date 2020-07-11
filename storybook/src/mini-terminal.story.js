import React from "react";
import { MiniTerminalTransitions } from "@code-hike/mini-terminal";
import { WithProgress, Page } from "./utils";

export default {
  title: "Mini Terminal",
};

export const basic = () => (
  <Page>
    <MiniTerminalTransitions
      style={{ width: 300 }}
      steps={["$ foo"]}
      progress={0}
    />
  </Page>
);

const steps = ["$ one", "$ two", "$ three"];

export const transitions = () => (
  <WithProgress length={steps.length}>
    {(progress) => (
      <MiniTerminalTransitions progress={progress} steps={steps} />
    )}
  </WithProgress>
);
