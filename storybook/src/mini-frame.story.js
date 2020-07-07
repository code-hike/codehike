import React from "react";
import { storiesOf } from "@storybook/react";
import { MiniFrame, FrameButtons } from "@code-hike/mini-frame";

storiesOf("Mini Frame", module)
  .add("Basic", () => (
    <MiniFrame style={{ width: 300 }} title="This Frame Title">
      <div style={{ height: 200, background: "beige", padding: 10 }}>
        Lorem Ipsum
      </div>
    </MiniFrame>
  ))
  .add("Long Title", () => (
    <MiniFrame
      style={{ width: 300 }}
      title="Lets test what happens if we put a very long title"
    >
      <div style={{ height: 200 }} />
    </MiniFrame>
  ))
  .add("No Title", () => (
    <MiniFrame>
      <div style={{ width: 100, height: 200 }} />
    </MiniFrame>
  ))
  .add("Custom Title Bar", () => (
    <MiniFrame
      titleBar={
        <>
          <FrameButtons />
          <div style={{ flex: 1 }}>Hello</div>
          <div style={{ marginRight: 7 }}>Bye</div>
        </>
      }
    >
      <div style={{ width: 100, height: 200 }} />
    </MiniFrame>
  ))
  .add("Overflow Y", () => (
    <MiniFrame style={{ height: 300 }}>
      <div style={{ height: 200, background: "salmon" }} />
      <div style={{ height: 200, background: "beige" }} />
    </MiniFrame>
  ));
