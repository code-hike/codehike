import React from "react"
import { EditorStep, StepFile } from "./use-snapshots"

export { mdxToStep, mdxToSteps }

type Settings = {
  defaultFileName?: string
}

function mdxToSteps(
  children: any[],
  settings: Settings = {}
) {
  const steps = [] as EditorStep[]
  children.forEach((child, i) => {
    steps.push(mdxToStep(child, steps[i - 1], settings))
  })
  return steps
}

const defaultFileName = "index.js"

function mdxToStep(
  child: any,
  prev: EditorStep | undefined,
  settings: Settings = {}
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
    preToFile(pre, prev ? prev.files : [], settings)
  )
  const southFiles = southChildren?.map(pre =>
    preToFile(pre, prev ? prev.files : [], settings)
  )

  return {
    files: [...northFiles, ...(southFiles || [])],
    northPanel: {
      tabs: chooseNorthTabs(prev, northFiles, southFiles),
      active: chooseActiveFile(northFiles, prev),
      heightRatio: 0.5,
    },
    southPanel:
      southFiles && southFiles.length
        ? {
            tabs: chooseSouthTabs(
              prev,
              northFiles,
              southFiles
            ),
            active: chooseActiveFile(southFiles, prev),
            heightRatio: 0.5,
          }
        : undefined,
  }
}

function chooseNorthTabs(
  prev: EditorStep | undefined,
  northFiles: FileWithOptions[],
  southFiles: FileWithOptions[] | undefined
) {
  // old north tabs + new north tabs (except hidden) - new south tabs
  const oldNorthTabs = prev?.northPanel.tabs || []
  const newSouthTabs = (southFiles || []).map(f => f.name)
  const newNorthTabs = northFiles
    .filter(
      f => !f.hidden && !oldNorthTabs.includes(f.name)
    )
    .map(f => f.name)

  const baseTabs = oldNorthTabs.filter(
    tab => !newSouthTabs.includes(tab)
  )
  return [...baseTabs, ...newNorthTabs]
}

function chooseSouthTabs(
  prev: EditorStep | undefined,
  northFiles: FileWithOptions[],
  southFiles: FileWithOptions[]
) {
  // old south tabs + new south tabs (except hidden) - new north tabs
  const oldSouthTabs = prev?.southPanel?.tabs || []
  const newSouthTabs = (southFiles || [])
    .filter(
      f => !f.hidden && !oldSouthTabs.includes(f.name)
    )
    .map(f => f.name)
  const newNorthTabs = northFiles.map(f => f.name)

  const baseTabs = oldSouthTabs.filter(
    tab => !newNorthTabs.includes(tab)
  )
  return [...baseTabs, ...newSouthTabs]
}

function chooseActiveFile(
  panelFiles: FileWithOptions[],
  prev?: EditorStep
) {
  return (
    panelFiles.find(file => file.active)?.name ||
    panelFiles[0].name
  )
}

type FileOptions = {
  focus?: string
  active?: string
  hidden?: boolean
}

type FileWithOptions = StepFile & FileOptions

function preToFile(
  preElement: any,
  prevFiles: StepFile[],
  settings: Settings
): FileWithOptions {
  const codeElementProps =
    preElement?.props?.children?.props || {}
  const lang = codeElementProps.className?.slice(9)
  const { name, ...options } = parseMetastring(
    codeElementProps.metastring ||
      settings?.defaultFileName ||
      defaultFileName
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
    ...options,
  }
}

function parseMetastring(
  metastring: string
): { name: string } & FileOptions {
  const [name, ...params] = metastring.split(" ")
  const options = {} as FileOptions
  params.forEach(param => {
    const [key, value] = param.split("=")
    ;(options as any)[key] = value != null ? value : true
  })
  console.log(metastring, options)
  return { name, ...options }
}
