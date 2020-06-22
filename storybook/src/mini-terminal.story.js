import React from "react";
import { storiesOf } from "@storybook/react";
import { MiniTerminal } from "@code-hike/mini-terminal";

storiesOf("Mini Terminal", module).add("Basic", () => <Story />);

function Story() {
  return <MiniTerminal style={{ width: 300 }}></MiniTerminal>;
}
