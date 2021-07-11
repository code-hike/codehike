import React from "react"
import { Page } from "./utils"
import {
  Hike as HikeComponent,
  StepHead,
  Focus,
  CodeSlot,
  PreviewSlot,
  AnchorOrFocus,
} from "@code-hike/scrollycoding"
import "@code-hike/scrollycoding/dist/index.css"
import Basic from "./assets/scrollycoding.basic.mdx"
import WithDeps from "./assets/scrollycoding.deps.mdx"
import RepeatedSteps from "./assets/scrollycoding.repeat.mdx"
import { MDXProvider } from "@mdx-js/react"

export default {
  title: "Test/ScrollyCoding",
}

export function basic() {
  return (
    <Page
      style={{
        // outline: "2px solid darkblue",
        maxWidth: 800,
      }}
    >
      <MDXProvider components={components}>
        <Basic />
      </MDXProvider>
    </Page>
  )
}

export function withDeps() {
  return (
    <Page
      style={{
        maxWidth: 800,
      }}
    >
      <MDXProvider components={components}>
        <WithDeps />
      </MDXProvider>
    </Page>
  )
}

export function repeatedSteps() {
  return (
    <Page
      style={{
        maxWidth: 800,
      }}
    >
      <MDXProvider components={components}>
        <RepeatedSteps />
      </MDXProvider>
    </Page>
  )
}

const components = {
  Hike,
  StepHead,
  Focus,
  CodeSlot,
  PreviewSlot,
  a: AnchorOrFocus,
}

function Hike({ codeProps, ...props }) {
  const preset = {
    template: "react",
    customSetup: {
      dependencies: { "react-svg-curve": "latest" },
    },
  }

  return (
    <HikeComponent
      {...props}
      preset={preset}
      editorProps={{
        codeProps: {
          minColumns: 40,
          minZoom: 0.9,
          ...codeProps,
        },
      }}
    />
  )
}
