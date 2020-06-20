import React from "react";
import { storiesOf } from "@storybook/react";
import { MiniBrowser } from "@code-hike/mini-browser";

storiesOf("Mini Browser", module).add("Basic", () => <Story />);

function Story() {
  return (
    <MiniBrowser>
      <div style={{ width: 200, background: "salmon" }}>Hey</div>
    </MiniBrowser>
  );
}
