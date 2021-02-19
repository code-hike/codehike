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
import Content from "./assets/scrollycoding.mdx"
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
        <Content />
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
  const steps = useMdxSteps(children, previewProps, {
    minColumns: 46,
    ...codeProps,
  })

  return <HikeComponent steps={steps} {...props} />
}
