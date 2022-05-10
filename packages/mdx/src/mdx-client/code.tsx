import React from "react"
import { CodeSpring } from "../smooth-code"
import {
  EditorSpring,
  EditorProps,
  EditorStep,
} from "../mini-editor"
import { CodeHikeConfig } from "remark/config"

export function Code(
  props: EditorProps & Partial<CodeHikeConfig>
) {
  const [step, setStep] = React.useState(props)

  function onTabClick(filename: string) {
    const newStep = updateEditorStep(step, filename, null)
    setStep({ ...step, ...newStep })
  }

  return <InnerCode {...step} onTabClick={onTabClick} />
}

export function InnerCode({
  onTabClick,
  ...props
}: EditorProps & {
  onTabClick?: (filename: string) => void
} & Partial<CodeHikeConfig>) {
  const {
    lineNumbers,
    showCopyButton,
    className,
    style,
    ...editorProps
  } = props

  const codeConfig = {
    ...props.codeConfig,
    lineNumbers:
      lineNumbers == null
        ? props.codeConfig?.lineNumbers
        : lineNumbers,
    showCopyButton:
      showCopyButton == null
        ? props.codeConfig?.showCopyButton
        : showCopyButton,
  }

  if (
    !props.southPanel &&
    props.files.length === 1 &&
    !props.files[0].name
  ) {
    return (
      <div
        className={`ch-codeblock not-prose ${
          className || ""
        }`}
        style={style}
      >
        <CodeSpring
          className="ch-code"
          config={codeConfig}
          step={editorProps.files[0]}
        />
      </div>
    )
  } else {
    const frameProps = {
      ...editorProps?.frameProps,
      onTabClick,
    }
    return (
      <div
        className={`ch-codegroup not-prose ${
          className || ""
        }`}
        style={style}
      >
        <EditorSpring
          {...editorProps}
          frameProps={frameProps}
          codeConfig={codeConfig}
        />
      </div>
    )
  }
}

export function updateEditorStep(
  step: EditorStep,
  filename: string | undefined,
  focus: string | null
): EditorStep {
  const name = filename || step.northPanel.active
  const newFiles = step.files.map((file: any) =>
    file.name === name
      ? {
          ...file,
          focus: focus === null ? file.focus : focus,
        }
      : file
  )

  let northPanel = { ...step.northPanel }
  let southPanel = step.southPanel && {
    ...step.southPanel,
  }
  if (step.northPanel.tabs.includes(name)) {
    northPanel.active = name
  } else if (southPanel) {
    southPanel.active = name
  }
  return { files: newFiles, northPanel, southPanel }
}
