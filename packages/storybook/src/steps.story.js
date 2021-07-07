import React from "react"

import { WithProgress } from "./utils"
import { MDXProvider } from "@mdx-js/react"
import BasicSteps from "./assets/steps.basic.mdx"
import SvelteSteps from "./assets/steps.svelte.mdx"
import ReactSteps from "./assets/steps.react.mdx"
import {
  MiniEditorHike,
  mdxToSteps,
} from "@code-hike/mini-editor"
import "prism-svelte"
import "./assets/styles.css"

export default {
  title: "Test/Steps From MDX",
}

export function basic() {
  return (
    <MDXProvider components={components}>
      <BasicSteps />
    </MDXProvider>
  )
}

export function svelte() {
  return (
    <MDXProvider components={components}>
      <SvelteSteps />
    </MDXProvider>
  )
}

export function react() {
  return (
    <MDXProvider components={components}>
      <ReactSteps />
    </MDXProvider>
  )
}

const components = {
  wrapper: Wrapper,
  StepHead,
}

function Wrapper({ children }) {
  const stepChildren = React.Children.toArray(
    children
  ).filter(child => child?.props?.mdxType === "StepHead")
  const steps = mdxToSteps(stepChildren, {
    defaultFileName: "App.js",
  })

  console.log(steps)
  return (
    <WithProgress
      length={steps.length}
      style={{ maxWidth: 821 }}
      className="steps-story"
      start={0}
    >
      {(progress, backward) => (
        <MiniEditorHike
          frameProps={{
            className: "",
            style: {
              height: 688,
              width: 821,
            },
          }}
          codeProps={{
            minColumns: 20,
            maxZoom: 1.5,
          }}
          progress={progress}
          backward={backward}
          steps={steps}
        />
      )}
    </WithProgress>
  )
}

function StepHead({ children }) {
  return "Hi"
}
