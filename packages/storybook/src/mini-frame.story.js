import React from "react"
import {
  MiniFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import { Page } from "./utils"

export default {
  title: "Mini Frame",
}

export const basic = () => (
  <Page>
    <MiniFrame title="This">
      <div
        style={{
          height: 200,
          background: "beige",
          padding: 10,
        }}
      >
        Lorem Ipsum
      </div>
    </MiniFrame>
  </Page>
)

export const basicZoom = () => (
  <Page>
    <MiniFrame title="This" zoom={2}>
      <div
        style={{
          height: 200,
          background: "beige",
          padding: 10,
        }}
      >
        Lorem Ipsum
      </div>
    </MiniFrame>
  </Page>
)

export const longTitle = () => (
  <Page style={{ width: 300 }}>
    <MiniFrame title="Lets test what happens if we put a very long title">
      <div style={{ height: 200 }} />
    </MiniFrame>
  </Page>
)

export const noTitle = () => (
  <Page>
    <MiniFrame>
      <div style={{ width: 100, height: 200 }} />
    </MiniFrame>
  </Page>
)

export const customTitleBar = () => (
  <Page>
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
  </Page>
)

export const overflowY = () => (
  <Page>
    <MiniFrame style={{ height: 300 }}>
      <div style={{ height: 200, background: "salmon" }} />
      <div style={{ height: 200, background: "beige" }} />
    </MiniFrame>
  </Page>
)

export const overflowYZoomIn = () => (
  <Page>
    <MiniFrame style={{ height: 300 }} zoom={2}>
      <div style={{ height: 200, background: "salmon" }} />
      <div style={{ height: 200, background: "beige" }} />
    </MiniFrame>
  </Page>
)

export const overflowYZoomOut = () => (
  <Page>
    <MiniFrame style={{ height: 300 }} zoom={0.5}>
      <div style={{ height: 200, background: "salmon" }} />
      <div style={{ height: 200, background: "beige" }} />
      <div
        style={{ height: 200, background: "darksalmon" }}
      />
    </MiniFrame>
  </Page>
)

export const overflowX = () => (
  <Page style={{ width: 200 }}>
    <MiniFrame>
      <div
        style={{
          height: 100,
          width: 240,
          background: "salmon",
        }}
      />
    </MiniFrame>
  </Page>
)
