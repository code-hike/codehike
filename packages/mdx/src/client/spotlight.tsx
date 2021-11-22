import React from "react"
import {
  EditorProps,
  EditorStep,
} from "@code-hike/mini-editor"
import { Code } from "./code"
import { Preview, PresetConfig } from "./preview"

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
