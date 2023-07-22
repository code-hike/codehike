import React from "react"
import { EditorStep } from "../mini-editor"
import { InnerCode, updateEditorStep } from "./code"
import { Preview, PresetConfig } from "./preview"
import { extractPreviewSteps } from "./steps"
import {
  CodeConfigProps,
  ElementProps,
  GlobalConfig,
} from "../core/types"

type SpotlightProps = {
  globalConfig: GlobalConfig
  // data
  children: React.ReactNode
  editorSteps: EditorStep[]
  presetConfig?: PresetConfig
  hasPreviewSteps?: boolean
  // local config
  start?: number
} & CodeConfigProps &
  ElementProps

export function Spotlight({
  children,
  editorSteps,
  globalConfig,
  start = 0,
  presetConfig,
  className,
  style,
  hasPreviewSteps,
  ...codeConfigProps
}: SpotlightProps) {
  const { stepsChildren, previewChildren } =
    extractPreviewSteps(children, hasPreviewSteps)

  const withPreview = presetConfig || hasPreviewSteps

  const [state, setState] = React.useState({
    stepIndex: start,
    step: editorSteps[start],
  })

  const tab = state.step

  function onTabClick(filename: string) {
    const newStep = updateEditorStep(
      state.step,
      filename,
      null
    )
    setState({ ...state, step: newStep })
  }

  const headerElement =
    stepsChildren[0] as React.ReactElement

  return (
    <section
      className={`ch-spotlight ${
        withPreview ? "ch-spotlight-with-preview" : ""
      } ${className || ""}`}
      style={style}
      data-ch-theme={globalConfig.themeName}
    >
      <div className="ch-spotlight-tabs">
        {headerElement?.props?.children ? (
          <div>{stepsChildren[0]}</div>
        ) : null}
        {stepsChildren.map((children, i) =>
          i === 0 ? null : (
            <div
              key={i}
              onClick={() =>
                setState({
                  stepIndex: i,
                  step: editorSteps[i],
                })
              }
              className="ch-spotlight-tab"
              data-selected={
                i === state.stepIndex ? "true" : undefined
              }
            >
              {children}
            </div>
          )
        )}
      </div>
      <div className="ch-spotlight-sticker">
        <InnerCode
          editorStep={tab}
          globalConfig={globalConfig}
          codeConfigProps={codeConfigProps}
          onTabClick={onTabClick}
        />
        {presetConfig ? (
          <Preview
            className="ch-spotlight-preview"
            files={tab.files}
            presetConfig={presetConfig}
            globalConfig={globalConfig}
          />
        ) : hasPreviewSteps ? (
          <Preview
            className="ch-spotlight-preview"
            {...previewChildren[state.stepIndex]["props"]}
            globalConfig={globalConfig}
          />
        ) : null}
      </div>
    </section>
  )
}
