import React from "react";
import { MiniBrowser } from "@code-hike/mini-browser";
import { WithProgress, Page } from "./utils";

export default {
  title: "Mini Browser",
};

export const basic = () => (
  <Page>
    <MiniBrowser url="https://localhost:8000" style={{}}>
      <div style={{ background: "beige", height: 200 }}>Lorem Ipsum</div>
    </MiniBrowser>
  </Page>
);

export const iframe = () => (
  <Page>
    <MiniBrowser url="https://whatismyviewport.com/" style={{ height: 300 }} />
  </Page>
);
