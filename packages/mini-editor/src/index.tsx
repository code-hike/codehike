import "./index.scss"

import {
  MiniEditorTween,
  MiniEditorTweenProps,
} from "./mini-editor-tween"
import {
  MiniEditorHike,
  MiniEditorHikeProps,
} from "./mini-editor-hike"
import {
  MiniEditor,
  MiniEditorProps,
} from "./mini-editor-spring"
import { mdxToStep, mdxToSteps } from "./mdx"

import { EditorTween } from "./editor-tween"
import {
  EditorSpring,
  EditorProps,
  EditorStep,
  CodeFile,
} from "./editor-spring"

export {
  EditorTween,
  EditorSpring,
  EditorProps,
  EditorStep,
  CodeFile,
  // deprecate:
  mdxToStep,
  mdxToSteps,
  MiniEditorTween,
  MiniEditorTweenProps,
  MiniEditor,
  MiniEditorProps,
  MiniEditorHike,
  MiniEditorHikeProps,
}
