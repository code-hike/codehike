import React from "react";
import { storiesOf } from "@storybook/react";
import { MiniFrame } from "@code-hike/mini-frame";

storiesOf("Mini Frame", module).add("Basic", () => <Story />);

function Story() {
  return (
    <MiniFrame style={{ width: 300 }}>
      <div style={{ width: 200, background: "salmon" }}>Hey</div>
    </MiniFrame>
  );
}
