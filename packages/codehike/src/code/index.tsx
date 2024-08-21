import type {
  Token,
  RawCode,
  HighlightedCode,
  CodeAnnotation,
  Theme,
  InlineAnnotation,
  BlockAnnotation,
  InlineAnnotationComponent,
  BlockAnnotationComponent,
  AnnotationHandler,
  CustomPreProps,
  CustomPre,
  CustomLine,
  CustomLineWithAnnotation,
  CustomToken,
  CustomTokenWithAnnotation,
  InlineProps,
} from "./types.js"

import { highlight } from "./highlight.js"
import { Pre, Inline } from "./pre.js"
import { InnerPre, getPreRef, InnerLine, InnerToken } from "./inner.js"

export type {
  RawCode,
  HighlightedCode,
  Token,
  InlineAnnotation,
  BlockAnnotation,
  CodeAnnotation,
  // AnnotationHandler:
  AnnotationHandler,
  InlineProps,
  CustomPre,
  CustomPreProps,
  BlockAnnotationComponent,
  CustomLine,
  CustomLineWithAnnotation,
  InlineAnnotationComponent,
  CustomToken,
  CustomTokenWithAnnotation,
  Theme,
}

export { highlight, Pre, InnerPre, InnerLine, InnerToken, getPreRef, Inline }
