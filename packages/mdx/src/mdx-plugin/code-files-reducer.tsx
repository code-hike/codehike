import { EditorStep, CodeFile } from "../mini-editor"

// extend steps with info from previous steps

export function reduceSteps(
  baseStep: EditorStep,
  extraStep: EditorStep
): EditorStep {
  let files = reduceFiles(baseStep.files, extraStep.files)

  return {
    ...baseStep,
    ...extraStep,
    files: files,
    northPanel: reducePanel(
      baseStep.northPanel,
      extraStep.northPanel,
      extraStep.southPanel
    )!,
    southPanel: reducePanel(
      baseStep.southPanel,
      extraStep.southPanel,
      extraStep.northPanel
    ),
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
  baseFiles: CodeFile[],
  extraFiles: CodeFile[]
): CodeFile[] {
  const filesMap = {} as { [name: string]: CodeFile }
  baseFiles.forEach(f => (filesMap[f.name] = f))
  extraFiles.forEach(ef => {
    const bf = filesMap[ef.name]
    if (!bf) {
      filesMap[ef.name] = ef
      return
    }

    // merge old and new files
    const { code, ...rest } = ef
    if (isEmpty(code)) {
      filesMap[ef.name] = { ...bf, ...rest }
    } else {
      filesMap[ef.name] = ef
    }
  })

  const result = [] as CodeFile[]
  baseFiles.forEach(f => {
    result.push(filesMap[f.name])
    delete filesMap[f.name]
  })
  extraFiles.forEach(
    f => filesMap[f.name] && result.push(filesMap[f.name])
  )

  return result
}

function isEmpty(code: CodeFile["code"]) {
  const anyContent = code.lines.some(l =>
    l.tokens.some(t => t.content.trim() == "")
  )
  return !anyContent
}
