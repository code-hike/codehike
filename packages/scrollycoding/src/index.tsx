import * as React from "react"
import "./index.scss"
import { Hike } from "./hike"

import {
  Focus,
  AnchorOrFocus,
  withFocusHandler,
} from "./focus"
import { CodeSlot, PreviewSlot } from "./fixed-layout"
import { useMdxSteps, StepHead } from "./mdx-steps"
import {
  HikeProps,
  CodeProps,
  PreviewProps,
} from "./hike-context"

export {
  Hike,
  Focus,
  CodeSlot,
  PreviewSlot,
  HikeProps,
  CodeProps,
  PreviewProps,
  useMdxSteps,
  StepHead,
  AnchorOrFocus,
  withFocusHandler,
}
