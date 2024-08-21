import { renderLineContent } from "./inline.js"
import { isGroup, LineGroup, LinesOrGroups, LineTokens } from "./lines.js"
import { toLineContent } from "./tokens.js"
import { InnerLine } from "./inner.js"
import {
  AnnotationHandler,
  BlockAnnotation,
  CustomLineProps,
  InlineAnnotation,
} from "./types.js"

export function renderLines({
  linesOrGroups,
  handlers,
  inlineAnnotations,
  annotationStack = [],
}: {
  linesOrGroups: LinesOrGroups
  handlers: AnnotationHandler[]
  inlineAnnotations: InlineAnnotation[]
  annotationStack?: BlockAnnotation[]
}) {
  return linesOrGroups.map((group) =>
    isGroup(group) ? (
      <LineBlock
        key={group.range[0]}
        group={group}
        handlers={handlers}
        inlineAnnotations={inlineAnnotations}
        annotationStack={annotationStack}
      />
    ) : (
      <Line
        key={group.lineNumber}
        line={group}
        handlers={handlers}
        inlineAnnotations={inlineAnnotations}
        annotationStack={annotationStack}
      />
    ),
  )
}

function Line({
  line,
  handlers,
  inlineAnnotations,
  annotationStack = [],
}: {
  line: LineTokens
  handlers: AnnotationHandler[]
  inlineAnnotations: InlineAnnotation[]
  annotationStack?: BlockAnnotation[]
}) {
  const { lineNumber, totalLines, indentation } = line
  const lineAnnotations = inlineAnnotations.filter(
    (annotation) => annotation.lineNumber === lineNumber,
  )

  const lineContent = toLineContent(line.tokens, lineAnnotations)
  const stack = buildLineStack(handlers, annotationStack)

  let children: React.ReactNode = renderLineContent({
    content: lineContent,
    handlers,
    annotationStack,
  })

  const merge = { lineNumber, indentation, totalLines, _stack: stack }

  return (
    <InnerLine merge={merge} key={lineNumber}>
      {children}
    </InnerLine>
  )
}

// A group of lines targeted by a block annotation
function LineBlock({
  group,
  handlers,
  inlineAnnotations,
  annotationStack,
}: {
  group: LineGroup
  handlers: AnnotationHandler[]
  inlineAnnotations: InlineAnnotation[]
  annotationStack: BlockAnnotation[]
}) {
  const { annotation, lines } = group
  const { name } = annotation
  const Component = handlers.find((c) => c.name === name)?.Block
  const children = renderLines({
    linesOrGroups: lines,
    handlers,
    inlineAnnotations,
    annotationStack: [...annotationStack, annotation],
  })
  return Component ? (
    <Component annotation={annotation}>{children}</Component>
  ) : (
    children
  )
}

function buildLineStack(
  handlers: AnnotationHandler[],
  annotationStack: BlockAnnotation[],
) {
  const stack = [] as CustomLineProps["_stack"]
  handlers.forEach(({ name, Line, AnnotatedLine }) => {
    const annotations = annotationStack.filter((a) => a.name === name)

    if (AnnotatedLine) {
      annotations.forEach((annotation) => {
        stack.push({ Component: AnnotatedLine, annotation })
      })
    }
    if (Line) {
      if (!annotations.length) {
        stack.push({ Component: Line })
      }
      annotations.forEach((annotation) => {
        stack.push({ Component: Line, annotation })
      })
    }
  })
  return stack
}
