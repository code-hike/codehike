import React from "react"
import { SandpackRunnerProps } from "react-smooshpack"
import { CodeFiles, IFiles, TemplateProps } from "./context"
import { CodeProps } from "./code"
import { PreviewProps } from "./preview"

export { useMdxSteps, StepHead }

export interface StepHeadProps {
  children: any
  focus?: string
  activeFile?: string
  codeProps?: Partial<CodeProps>
  previewProps?: Partial<PreviewProps>
}

function StepHead(props: StepHeadProps) {
  return null
}

interface Step {
  content: React.ReactNode[]
  previewProps: PreviewProps
  codeProps: CodeProps
}

const defaultFilename = "App.js"

function useMdxSteps(
  mdx: React.ReactNode,
  previewProps: PreviewProps,
  codeProps: CodeProps,
  template: Partial<TemplateProps> = {}
) {
  const steps: Step[] = []
  React.Children.forEach(mdx, (child: any) => {
    if (child?.props?.mdxType === "StepHead") {
      const stepHeadProps = child?.props || {}
      const { files, activeFile } = getFiles(stepHeadProps)

      const step = {
        content: [],
        previewProps: getPreviewProps(
          stepHeadProps,
          previewProps,
          template,
          files
        ),
        codeProps: getCodeProps(
          stepHeadProps,
          codeProps,
          files,
          activeFile
        ),
      }
      steps.push(step)
    } else {
      steps[steps.length - 1].content.push(child)
    }
  })
  return steps
}

function getFiles(stepHeadProps: StepHeadProps) {
  let activeFile = stepHeadProps.activeFile || ""
  const files = {} as CodeFiles
  React.Children.forEach(
    stepHeadProps.children,
    preElement => {
      const codeElementProps =
        preElement?.props?.children?.props || {}
      const lang = codeElementProps.className?.slice(9)
      const filename =
        codeElementProps.metastring || defaultFilename
      const code = codeElementProps.children
      files[filename] = { code, lang }
      if (activeFile === "") {
        activeFile = filename
      }
    }
  )
  return { files, activeFile }
}

function getPreviewProps(
  stepHeadProps: StepHeadProps,
  hikePreviewProps: PreviewProps,
  hikeTemplate: Partial<TemplateProps>,
  codeFiles: CodeFiles
): PreviewProps {
  const files = {} as IFiles
  const filenames = Object.keys(codeFiles)
  filenames.forEach(filename => {
    files["/" + filename] = {
      code: codeFiles[filename].code,
    }
  })
  return {
    ...hikePreviewProps,
    template: hikeTemplate,
    ...stepHeadProps.previewProps,
    files,
  }
}

function getCodeProps(
  stepHeadProps: StepHeadProps,
  hikeCodeProps: CodeProps,
  files: CodeFiles,
  activeFile: string
): CodeProps {
  return {
    ...hikeCodeProps,
    ...stepHeadProps.codeProps,
    focus: stepHeadProps.focus || "",
    activeFile,
    files,
  }
}
