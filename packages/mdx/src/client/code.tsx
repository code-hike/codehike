import React from "react"
import { CodeSpring } from "@code-hike/smooth-code"
import {
  EditorSpring,
  EditorProps,
} from "@code-hike/mini-editor"

export function Code(props: EditorProps) {
  if (
    !props.southPanel &&
    props.files.length === 1 &&
    !props.files[0].name
  ) {
    return (
      <CodeSpring
        className="ch-code"
        config={props.codeConfig}
        step={props.files[0]}
      />
    )
  } else {
    return <EditorSpring {...props} />
  }
}
