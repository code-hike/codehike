import { configure } from "@storybook/react";

function loadStories() {
  require("./index.js");
}

configure(loadStories, module);
