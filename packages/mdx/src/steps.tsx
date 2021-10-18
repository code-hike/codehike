import {
  EditorStep,
  CodeFile,
} from "@code-hike/mini-editor"
import { Node, Parent } from "unist"
import { visitAsync, toJSX } from "./unist-utils"
import {
  mapEditor,
  Code,
  isEditorNode,
  mapAnyCodeNode,
} from "./code"
import { reduceSteps } from "./code-files-reducer"

// extract step info

export async function extractStepsInfo(
  parent: Parent,
  config: { theme: any }
) {
  const steps = [] as {
    editorStep: EditorStep
    children: Node[]
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
    if (!step.editorStep && isEditorNode(child)) {
      const {
        codeConfig,
        ...editorStep
      } = await mapAnyCodeNode(
        { node: child, parent, index: i },
        config
      )

      if (stepIndex === 0) {
        // for the header props, keep it as it is
        step.editorStep = editorStep
      } else {
        // for the rest, merge the editor step with the header step

        step.editorStep = reduceSteps(
          steps[0].editorStep,
          editorStep
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
    }
  })

  return steps.map(step => step.editorStep)
}
