import React from "react";
import { storiesOf } from "@storybook/react";
import { MiniBrowser } from "@code-hike/mini-browser";

storiesOf("Mini Browser", module)
  .add("Basic", () => (
    <MiniBrowser url="https://localhost:8000" style={{}}>
      <div style={{ background: "beige", height: 200 }}>Lorem Ipsum</div>
    </MiniBrowser>
  ))
  .add("Iframe", () => (
    <MiniBrowser
      url="https://whatismyviewport.com/"
      style={{ maxWidth: 500, height: 300 }}
    />
  ));
