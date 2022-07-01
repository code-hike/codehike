import { EditorStep } from "../mini-editor"
import { isEditorNode, mapAnyCodeNode } from "./code"
import { reduceStep } from "./code-files-reducer"
import { CodeHikeConfig } from "./config"
import { SuperNode } from "./nodes"

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
    children: SuperNode[]
  }[]

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
            : steps[stepIndex - 1].editorStep

        step.editorStep = reduceStep(
          baseStep,
          editorStep,
          filter
        )
      }
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

  return steps.map(step => step.editorStep)
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
