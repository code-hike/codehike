import { visitAsync, toJSX } from "./unist-utils"
import { Node, Parent } from "unist"
import React from "react"
import {
  EditorSpring,
  EditorProps,
  EditorStep,
} from "@code-hike/mini-editor"
import { mapEditor, Code } from "./code"
import { extractStepsInfo } from "./steps"
import {
  Preview,
  PresetConfig,
  getPresetConfig,
} from "./preview"

export function Spotlight({
  children,
  editorSteps,
  codeConfig,
  start = 0,
  presetConfig,
}: {
  children: React.ReactNode
  editorSteps: EditorStep[]
  codeConfig: EditorProps["codeConfig"]
  start?: number
  presetConfig?: PresetConfig
}) {
  const stepsChildren = React.Children.toArray(children)

  const [stepIndex, setIndex] = React.useState(start)
  const tab = editorSteps[stepIndex]

  const headerElement = stepsChildren[0] as React.ReactElement

  return (
    <div
      className={`ch-spotlight ${
        presetConfig ? "ch-spotlight-with-preview" : ""
      }`}
    >
      <div className="ch-spotlight-tabs">
        {headerElement?.props?.children ? (
          <div>{stepsChildren[0]}</div>
        ) : null}
        {stepsChildren.map((children, i) =>
          i === 0 ? null : (
            <div
              key={i}
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
      <div className="ch-spotlight-sticker">
        <Code {...(tab as any)} codeConfig={codeConfig} />
        {presetConfig && (
          <Preview
            className="ch-spotlight-preview"
            files={tab.files}
            presetConfig={presetConfig}
          />
        )}
      </div>
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
  const editorSteps = await extractStepsInfo(
    node as Parent,
    { theme },
    "merge steps with header"
  )

  const presetConfig = await getPresetConfig(
    (node as any).attributes
  )

  toJSX(node, {
    props: {
      codeConfig: { theme },
      editorSteps: editorSteps,
      presetConfig,
    },
    appendProps: true,
  })
}
