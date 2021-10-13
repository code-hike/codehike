import { visitAsync, toJSX } from "./unist-utils"
import { Node, Parent } from "unist"
import React from "react"
import {
  EditorSpring,
  EditorProps,
  EditorStep,
} from "@code-hike/mini-editor"
import { mapEditor, Code } from "./code"
import { reduceSteps } from "./code-files-reducer"

// todo copy from https://codesandbox.io/s/3iul1?file=/src/App.js
export function Spotlight({
  children,
  editorSteps,
  codeConfig,
}: {
  children: React.ReactNode
  editorSteps: EditorStep[]
  codeConfig: EditorProps["codeConfig"]
}) {
  const stepsChildren = React.Children.toArray(children)

  const [stepIndex, setIndex] = React.useState(0)
  const tab = editorSteps[stepIndex]
  return (
    <div className="ch-spotlight">
      <div className="ch-spotlight-tabs">
        <div>{stepsChildren[0]}</div>
        {stepsChildren.map((children, i) =>
          i === 0 ? null : (
            <div
              onClick={() => setIndex(i)}
              className="ch-spotlight-tab"
              data-selected={
                i === stepIndex ? "true" : undefined
              }
            >
              {children}
            </div>
          )
        )}
      </div>
      <Code {...(tab as any)} codeConfig={codeConfig} />
    </div>
  )
}

export async function transformSpotlights(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async node => {
      if (node.name === "CH.Spotlight") {
        await transformSpotlight(node, config)
      }
    }
  )
}

async function transformSpotlight(
  node: Node,
  { theme }: { theme: any }
) {
  const tabs = [] as {
    editorStep: EditorStep
    children: Node[]
  }[]
  let tabIndex = 0
  const children = (node as Parent).children || []
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (child.type === "thematicBreak") {
      tabIndex++
      continue
    }

    tabs[tabIndex] = tabs[tabIndex] || { children: [] }
    const tab = tabs[tabIndex]
    if (
      !tab.editorStep &&
      child.type === "mdxJsxFlowElement" &&
      child.name === "CH.Code"
    ) {
      const { codeConfig, ...editorStep } = await mapEditor(
        { node: child, parent: node as Parent, index: i },
        { theme }
      )

      if (tabIndex === 0) {
        // for the header props, keep it as it is
        tab.editorStep = editorStep
      } else {
        // for the rest, merge the editor step with the header step

        tab.editorStep = reduceSteps(
          tabs[0].editorStep,
          editorStep
        )
      }
    } else {
      tab.children.push(child)
    }
  }

  node.children = tabs.map(tab => {
    return {
      type: "mdxJsxFlowElement",
      children: tab.children,
    }
  })

  toJSX(node, {
    props: {
      codeConfig: { theme },
      editorSteps: tabs.map(t => t.editorStep),
    },
  })
}
