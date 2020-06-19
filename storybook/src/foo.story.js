import React from "react";
import { storiesOf } from "@storybook/react";
import { MiniBrowser } from "@code-hike/mini-browser";

storiesOf("Basic", module).add("Steps", () => <Story />);

function Story() {
  return <MiniBrowser>Story</MiniBrowser>;
}
