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
import { extractStepsInfo } from "./steps"

export function Scrollycoding({
  children,
  editorSteps,
  codeConfig,
  start = 0,
}: {
  children: React.ReactNode
  editorSteps: EditorStep[]
  codeConfig: EditorProps["codeConfig"]
  start?: number
}) {
  const stepsChildren = React.Children.toArray(children)

  const [stepIndex, setIndex] = React.useState(start)
  const tab = editorSteps[stepIndex]
  return (
    <div className="ch-scrollycoding">
      <div>
        {stepsChildren.map((children, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            data-selected={
              i === stepIndex ? "true" : undefined
            }
          >
            {children}
          </div>
        ))}
      </div>
      <div>
        <Code {...(tab as any)} codeConfig={codeConfig} />
      </div>
    </div>
  )
}

export async function transformScrollycodings(
  tree: Node,
  config: { theme: any }
) {
  await visitAsync(
    tree,
    "mdxJsxFlowElement",
    async node => {
      if (node.name === "CH.Scrollycoding") {
        await transformScrollycoding(node, config)
      }
    }
  )
}
async function transformScrollycoding(
  node: Node,
  { theme }: { theme: any }
) {
  const editorSteps = await extractStepsInfo(
    node as Parent,
    { theme }
  )

  toJSX(node, {
    props: {
      codeConfig: { theme },
      editorSteps: editorSteps,
    },
    appendProps: true,
  })
}
