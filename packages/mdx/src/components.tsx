import {
  Section,
  SectionLink,
  SectionCode,
} from "./mdx-client/section"
import { Code } from "./mdx-client/code"
import { Spotlight } from "./mdx-client/spotlight"
import { Scrollycoding } from "./mdx-client/scrollycoding"
import { CodeSlot, PreviewSlot } from "./mdx-client/slots"
import { Slideshow } from "./mdx-client/slideshow"
import { Chat } from "./mdx-client/chat"
import {
  annotationsMap,
  Annotation,
} from "./mdx-client/annotations"
import { Preview } from "./mdx-client/preview"
import { InlineCode } from "./mdx-client/inline-code"
import type { MDXComponents } from "mdx/types"

export {
  Chat,
  Code,
  Section,
  SectionLink,
  SectionCode,
  Spotlight,
  Scrollycoding,
  Preview,
  annotationsMap as annotations,
  Annotation,
  Slideshow,
  InlineCode,
  CodeSlot,
  PreviewSlot,
}

export const CH: MDXComponents = {
  Code,
  Section,
  SectionLink,
  SectionCode,
  Spotlight,
  Scrollycoding,
  Preview,
  annotations: annotationsMap,
  Annotation,
  Slideshow,
  InlineCode,
  CodeSlot,
  PreviewSlot,
}

import { MiniBrowser } from "./mini-browser"
import { EditorSpring } from "./mini-editor"

export const internal = {
  MiniBrowser,
  EditorSpring,
}
