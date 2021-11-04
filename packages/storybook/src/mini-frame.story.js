import React from "react"
import {
  MiniFrame,
  SimpleFrame,
  FrameButtons,
} from "@code-hike/mini-frame"
import "@code-hike/mini-frame/dist/index.css"
import { Page } from "./utils"

export default {
  title: "Test/Mini Frame",
}

export const basic = () => (
  <Page>
    <MiniFrame title="This" style={{ height: 200 }}>
      <div
        style={{
          height: "100%",
          background: "beige",
          // padding: 10,
        }}
      >
        Lorem Ipsum
      </div>
    </MiniFrame>
  </Page>
)

export const basicZoom = () => (
  <Page>
    <MiniFrame
      title="This"
      zoom={2}
      style={{ height: 200 }}
    >
      <div
        style={{
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
  <Page>
    <MiniFrame
      title="Lets test what happens if we put a very long title"
      style={{ width: 300, height: 200 }}
    >
      <div />
    </MiniFrame>
  </Page>
)

export const noTitle = () => (
  <Page>
    <MiniFrame style={{ width: 300, height: 200 }}>
      <div />
    </MiniFrame>
  </Page>
)

export const customTitleBar = () => (
  <Page>
    <MiniFrame
      style={{ width: 300, height: 200 }}
      titleBar={
        <>
          <FrameButtons />
          <div style={{ flex: 1 }}>Hello</div>
          <div style={{ marginRight: 7 }}>Bye</div>
        </>
      }
    >
      <div />
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
  <Page>
    <MiniFrame style={{ width: 200, height: 300 }}>
      <div
        style={{
          width: 240,
          height: 100,
          background: "salmon",
        }}
      />
    </MiniFrame>
  </Page>
)

export const simple = () => (
  <Page>
    <SimpleFrame>
      <div
        style={{
          width: 240,
          height: 100,
          background: "salmon",
        }}
      />
    </SimpleFrame>
  </Page>
)
