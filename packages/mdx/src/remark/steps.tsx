import { EditorStep } from "../mini-editor"
import { isEditorNode, mapAnyCodeNode } from "./code"
import { reduceStep } from "./code-files-reducer"
import { CodeHikeConfig } from "./config"
import { JsxNode, SuperNode } from "./nodes"
import { getPresetConfig } from "./transform.preview"

// extract step info
export async function extractStepsInfo(
  parent: SuperNode,
  config: CodeHikeConfig,
  merge:
    | "merge steps with header"
    | "merge step with previous"
) {
  const steps = [] as {
    editorStep?: EditorStep
    previewStep?: JsxNode
    children: SuperNode[]
  }[]

  const presetConfig = await getPresetConfig(
    (parent as any).attributes
  )

  let stepIndex = 0
  const children = parent.children || []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.type === "thematicBreak") {
      stepIndex++
      continue
    }

    steps[stepIndex] = steps[stepIndex] || { children: [] }
    const step = steps[stepIndex]

    if (!step.editorStep && isEditorNode(child, config)) {
      const editorStep = await mapAnyCodeNode(
        { node: child, parent, index: i },
        config
      )

      const filter = getFilterFromEditorNode(child)

      if (stepIndex === 0) {
        // for the header props, keep it as it is
        step.editorStep = editorStep
      } else {
        // for the rest, merge the editor step with the header step or the prev step
        const baseStep =
          merge === "merge steps with header"
            ? steps[0].editorStep
            : previousEditorStep(steps, stepIndex)

        step.editorStep = reduceStep(
          baseStep,
          editorStep,
          filter
        )
      }
      const node = child as any
      step.children.push({
        type: "mdxJsxFlowElement",
        name: "CH.CodeSlot",
        attributes: node.attributes,
      })
    } else if (
      child.type === "mdxJsxFlowElement" &&
      child.name === "CH.Preview" &&
      // only add the preview if we have a preview in step 0
      (stepIndex === 0 ||
        steps[0].previewStep != null ||
        // or there is a global sandpack preset
        presetConfig)
    ) {
      step.previewStep = child
      step.children.push({
        type: "mdxJsxFlowElement",
        name: "CH.PreviewSlot",
      })
    } else {
      step.children.push(child)
    }
  }

  parent.children = steps.map(step => {
    return {
      type: "mdxJsxFlowElement",
      children: step.children,
      data: { editorStep: step.editorStep },
    }
  })

  const hasPreviewSteps =
    steps[0].previewStep !== undefined || presetConfig
  // if there is a CH.Preview in the first step or a preset config
  // build the previewStep list
  if (hasPreviewSteps) {
    const previewSteps = steps.map(step => step.previewStep)
    // fill empties with base step
    previewSteps.forEach((previewStep, i) => {
      if (!previewStep) {
        if (presetConfig) {
          // we fill the hole with a placeholder
          previewSteps[i] = { type: "mdxJsxFlowElement" }
        } else {
          previewSteps[i] =
            merge === "merge steps with header"
              ? previewSteps[0]
              : previewSteps[i - 1]
        }
      }
    })
    parent.children = parent.children.concat(previewSteps)
  }

  // fill editor steps holes
  const editorSteps = steps.map(step => step.editorStep)
  editorSteps.forEach((editorStep, i) => {
    if (!editorStep) {
      editorSteps[i] =
        merge === "merge steps with header"
          ? editorSteps[0]
          : editorSteps[i - 1]
    }
  })

  return {
    editorSteps,
    hasPreviewSteps,

    presetConfig,
  }
}

function previousEditorStep(
  steps: {
    editorStep?: EditorStep
  }[],
  index: number
) {
  if (index === 0) {
    throw new Error("The first step should have some code")
  }

  return (
    steps[index - 1].editorStep ||
    previousEditorStep(steps, index - 1)
  )
}

/**
 * Extracts the `show` prop from <CH.Code show={["foo.js", "bar.html"]} />
 */
function getFilterFromEditorNode(node: any) {
  const value = node.attributes?.find(
    a => a.name === "show"
  )?.value?.value

  if (value) {
    return JSON.parse(value)
  } else {
    return undefined
  }
}
