import React from "react"
import { EditorStep, StepFile } from "./use-snapshots"

export { mdxToStep, mdxToSteps }

function mdxToSteps(children: any[]) {
  const steps = [] as EditorStep[]
  children.forEach((child, i) => {
    steps.push(mdxToStep(child, steps[i - 1]))
  })
  return steps
}

const defaultFileName = "App.js"

function mdxToStep(
  child: any,
  prev?: EditorStep
): EditorStep {
  const stepProps = child?.props || {}
  const stepChildren = React.Children.toArray(
    stepProps.children
  )

  const separatorIndex = stepChildren.findIndex(
    (child: any) => child?.props?.mdxType === "hr"
  )

  const hasTwoPanels = separatorIndex !== -1

  const northChildren = hasTwoPanels
    ? stepChildren.slice(0, separatorIndex)
    : stepChildren
  const southChildren = hasTwoPanels
    ? stepChildren.slice(separatorIndex + 1)
    : null

  const northFiles = northChildren.map(pre =>
    preToFile(pre, prev ? prev.files : [])
  )
  const southFiles = southChildren?.map(pre =>
    preToFile(pre, prev ? prev.files : [])
  )

  return {
    files: [...northFiles, ...(southFiles || [])],
    northPanel: {
      tabs: northFiles.map(f => f.name),
      active: northFiles[0].name,
      heightRatio: 0.5,
    },
    southPanel:
      southFiles && southFiles.length
        ? {
            tabs: southFiles.map(f => f.name),
            active: southFiles[0].name,
            heightRatio: 0.5,
          }
        : undefined,
  }
}

function preToFile(preElement: any, prevFiles: StepFile[]) {
  const codeElementProps =
    preElement?.props?.children?.props || {}
  const lang = codeElementProps.className?.slice(9)
  const { name, ...options } = parseMetastring(
    codeElementProps.metastring || defaultFileName
  )
  const code = codeElementProps.children

  const prevFile = prevFiles.find(
    file => file.name === name
  )

  return {
    code:
      code.trim() === "" && prevFile ? prevFile.code : code,
    lang,
    name,
    focus: options.focus as string | undefined,
  }
}

function parseMetastring(
  metastring: string
): { name: string } & Record<string, string | true> {
  const [name, ...params] = metastring.split(" ")
  const options = {} as Record<string, string | true>
  params.forEach(param => {
    const [key, value] = param.split("=")
    options[key] = value != null ? value : true
  })
  return { name, ...options }
}
