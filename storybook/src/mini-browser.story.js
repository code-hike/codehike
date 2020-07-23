import React from "react";
import { MiniBrowser } from "@code-hike/mini-browser";
import { WithProgress, Page } from "./utils";

export default {
  title: "Mini Browser",
};

export const basic = () => (
  <Page>
    <MiniBrowser url="https://localhost:8000">
      <div style={{ background: "beige", height: 200 }}>Lorem Ipsum</div>
    </MiniBrowser>
  </Page>
);

export const iframe = () => (
  <Page>
    <MiniBrowser url="https://whatismyviewport.com/" style={{ height: 300 }} />
  </Page>
);

export const zoom = () => (
  <Page>
    <MiniBrowser
      url="https://whatismyviewport.com/"
      style={{ height: 300 }}
      zoom={0.5}
    />
  </Page>
);

export const video = () => (
  <Page>
    <MiniBrowser url="https://nextjs-static-props.now.sh/" height={300}>
      <video
        autoPlay
        loop
        muted
        playsInline
        type="video/mp4"
        src="https://pomb.us/static/demo-75c5b2395f634c494e40b8008eef20eb.mp4"
      />
    </MiniBrowser>
  </Page>
);
