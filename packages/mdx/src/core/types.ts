import type { Theme } from "@code-hike/lighter"
import type { CodeStep } from "../smooth-code"

type TriggerPosition = `${number}px` | `${number}%`

export type RemarkConfig = {
  // remark only
  theme: Theme
  autoImport?: boolean
  skipLanguages: string[]
  autoLink?: boolean
  // path to the current file, internal use only
  filepath?: string

  // client config
  lineNumbers?: boolean
  showCopyButton?: boolean
  staticMediaQuery?: string
  triggerPosition?: TriggerPosition
}

// the config that is passed from remark to the client components
export type GlobalConfig = {
  themeName: string
  lineNumbers?: boolean
  showCopyButton?: boolean
  staticMediaQuery?: string
  triggerPosition?: TriggerPosition

  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
}

export function toGlobalConfig({
  theme,
  staticMediaQuery,
  lineNumbers,
  showCopyButton,
  triggerPosition,
}: RemarkConfig): GlobalConfig {
  return {
    themeName:
      typeof theme === "string" ? theme : theme.name,
    staticMediaQuery,
    lineNumbers,
    showCopyButton,
    triggerPosition,
  }
}

export type CodeSettings = {
  // from global config
  lineNumbers?: boolean
  showCopyButton?: boolean
  staticMediaQuery?: string
  themeName?: string
  // scrollycoding only
  triggerPosition?: TriggerPosition

  showExpandButton?: boolean
  /* not really the height, when this changes we measure everything again */
  parentHeight?: any
  minColumns?: number
  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
  rows?: number | "focus" | (number | "focus")[]
  debug?: boolean
}

export type ElementProps = {
  style?: React.CSSProperties
  className?: string
}

export type CodeConfigProps = {
  rows?: number | "focus" | (number | "focus")[]
  showCopyButton?: boolean
  showExpandButton?: boolean
  lineNumbers?: boolean

  minZoom?: number
  maxZoom?: number
  horizontalCenter?: boolean
}

type EditorPanel = {
  tabs: string[]
  active: string
  heightRatio: number
}

export type EditorStep = {
  files: CodeFile[]
  northPanel: EditorPanel
  southPanel?: EditorPanel
  terminal?: string
}

export type CodeFile = CodeStep & {
  name: string
}
