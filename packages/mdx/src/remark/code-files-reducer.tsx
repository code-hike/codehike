import { EditorStep, CodeFile } from "../mini-editor"

// extend steps with info from previous steps

/**
 * Extends `extraStep` with info from `baseStep`.
 *
 * @param baseStep it could be the header step or the previous step
 * @param step the step to be extended
 * @param filter if it is defined, show only the files in the array.
 *
 */
export function reduceStep(
  baseStep: EditorStep,
  step: EditorStep,
  filter?: string[]
): EditorStep {
  let files = reduceFiles(baseStep.files, step.files)

  const newNorthPanel = reducePanel(
    baseStep.northPanel,
    step.northPanel,
    step.southPanel
  )!

  const newSouthPanel = reducePanel(
    baseStep.southPanel,
    step.southPanel,
    step.northPanel
  )

  if (filter) {
    newNorthPanel.tabs = newNorthPanel.tabs.filter(
      filename => filter.includes(filename)
    )

    if (newSouthPanel) {
      newNorthPanel.tabs = newNorthPanel.tabs.filter(
        filename => filter.includes(filename)
      )
    }
  }

  return {
    ...baseStep,
    ...step,
    files: files,
    northPanel: newNorthPanel,
    southPanel: newSouthPanel,
  }
}

type Panel = EditorStep["northPanel"]
function reducePanel(
  oldPanel: Panel | undefined,
  newPanel: Panel | undefined,
  otherNewPanel: Panel | undefined
) {
  if (!newPanel) {
    return newPanel
  }
  const oldTabsStillThere =
    oldPanel?.tabs?.filter(
      name => !otherNewPanel?.tabs?.includes(name)
    ) || []
  const realNewTabs =
    newPanel?.tabs?.filter(
      name => !oldPanel?.tabs?.includes(name)
    ) || []

  return {
    ...oldPanel,
    ...newPanel,
    tabs: [...oldTabsStillThere, ...realNewTabs],
  }
}

function reduceFiles(
  oldFiles: CodeFile[],
  newFiles: CodeFile[]
): CodeFile[] {
  const filesMap = {} as { [name: string]: CodeFile }
  oldFiles.forEach(f => (filesMap[f.name] = f))
  newFiles.forEach(newFile => {
    const prevFile = filesMap[newFile.name]
    if (!prevFile) {
      filesMap[newFile.name] = newFile
      return
    }

    // if the file is in both arrays, merge the content
    // but if the new file is empty, keep the old content
    const { code, ...rest } = newFile
    if (isEmpty(code)) {
      filesMap[newFile.name] = { ...prevFile, ...rest }
    } else {
      filesMap[newFile.name] = newFile
    }
  })

  // return a new array following the original order:
  // first the old files, then the new ones
  const result = [] as CodeFile[]
  oldFiles.forEach(f => {
    result.push(filesMap[f.name])
    delete filesMap[f.name]
  })
  newFiles.forEach(
    f => filesMap[f.name] && result.push(filesMap[f.name])
  )

  return result
}

function isEmpty(code: CodeFile["code"]) {
  const anyContent = code.lines.some(l =>
    l.tokens.some(t => t.content.trim() !== "")
  )
  return !anyContent
}
