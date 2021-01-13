import React from "react"
import { PresetProps } from "react-smooshpack"
import { CodeFiles, Demo } from "./context"
import { CodeProps } from "./editor"
import { PreviewProps } from "./preview"

export { useMdxSteps, StepHead }

function StepHead() {
  return null
}

interface Step {
  content: React.ReactNode[]
  demo: Demo
  previewProps: PreviewProps
  codeProps: CodeProps
}

function useMdxSteps(
  mdx: React.ReactNode,
  previewProps: PreviewProps,
  codeProps: CodeProps,
  preset: PresetProps = {}
) {
  const steps: Step[] = []
  React.Children.forEach(mdx, (child: any) => {
    if (child?.props?.mdxType === "StepHead") {
      const stepHeadProps = child?.props || {}
      const files = {} as CodeFiles
      let activeFile = stepHeadProps.activeFile || ""
      React.Children.forEach(
        stepHeadProps.children,
        preElement => {
          const codeElementProps =
            preElement?.props?.children?.props || {}
          const lang = codeElementProps.className?.slice(9)
          const filename = codeElementProps.metastring
          const code = codeElementProps.children
          files[filename] = { code, lang }
          if (activeFile === "") {
            activeFile = filename
          }
        }
      )
      const step = {
        content: [],
        demo: {
          focus: stepHeadProps.focus || "",
          files,
          activeFile,
          preset,
        },
        previewProps: {
          ...previewProps,
          ...stepHeadProps.previewProps,
        },
        codeProps: {
          ...codeProps,
          ...stepHeadProps.codeProps,
        },
      }
      steps.push(step)
    } else {
      steps[steps.length - 1].content.push(child)
    }
  })
  return steps
}
