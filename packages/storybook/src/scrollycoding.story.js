import React from "react"
import { Page } from "./utils"
import {
  Hike as HikeComponent,
  StepHead,
  Focus,
  CodeSlot,
  PreviewSlot,
  useMdxSteps,
} from "@code-hike/scrollycoding"
import "@code-hike/scrollycoding/dist/index.css"
import Basic from "./assets/scrollycoding.basic.mdx"
import WithDeps from "./assets/scrollycoding.deps.mdx"
import RepeatedSteps from "./assets/scrollycoding.repeat.mdx"
import { MDXProvider } from "@mdx-js/react"

export default {
  title: "ScrollyCoding",
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
}

function Hike({
  children,
  previewProps,
  codeProps,
  ...props
}) {
  const steps = useMdxSteps(
    children,
    {
      ...previewProps,
      preset: {
        customSetup: {
          dependencies: { "react-svg-curve": "latest" },
        },
      },
    },
    {
      minColumns: 46,
      minZoom: 0.9,
      ...codeProps,
    }
  )

  return <HikeComponent steps={steps} {...props} />
}
