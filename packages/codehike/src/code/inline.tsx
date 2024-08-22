import { InnerToken } from "./inner.js"
import { isGroup, LineContent, TokenGroup } from "./tokens.js"
import {
  AnnotationHandler,
  CodeAnnotation,
  CustomTokenProps,
  InternalToken,
} from "./types.js"

export function renderLineContent({
  content,
  handlers,
  annotationStack,
}: {
  content: LineContent
  handlers: AnnotationHandler[]
  annotationStack: CodeAnnotation[]
}) {
  return content.map((item, i) =>
    isGroup(item) ? (
      <InlinedTokens
        annotationStack={annotationStack}
        handlers={handlers}
        group={item}
        key={i}
      />
    ) : item.style ? (
      <FinalToken
        annotationStack={annotationStack}
        handlers={handlers}
        token={item}
        key={i}
      />
    ) : (
      // whitespace
      item.value
    ),
  )
}

function FinalToken({
  handlers,
  token,
  annotationStack,
}: {
  handlers: AnnotationHandler[]
  token: InternalToken
  annotationStack: CodeAnnotation[]
}) {
  const stack = buildTokenStack(handlers, annotationStack)
  return (
    <InnerToken
      merge={{ _stack: stack, style: token.style, value: token.value }}
    />
  )
}

function InlinedTokens({
  group,
  handlers,
  annotationStack,
}: {
  group: TokenGroup
  handlers: AnnotationHandler[]
  annotationStack: CodeAnnotation[]
}) {
  const { annotation, content } = group
  const { name } = annotation

  const children = renderLineContent({
    content,
    handlers,
    annotationStack: [...annotationStack, annotation],
  })

  const Component = handlers.find((c) => c.name === name)?.Inline
  return Component ? (
    <Component annotation={annotation}>{children}</Component>
  ) : (
    children
  )
}

function buildTokenStack(
  handlers: AnnotationHandler[],
  annotationStack: CodeAnnotation[],
) {
  const stack = [] as CustomTokenProps["_stack"]
  handlers.forEach(({ name, Token, AnnotatedToken }) => {
    const annotations = annotationStack.filter((a) => a.name === name)
    if (AnnotatedToken) {
      annotations.forEach((annotation) =>
        stack.push({ Component: AnnotatedToken, annotation }),
      )
    }
    if (Token) {
      if (!annotations.length) {
        stack.push({ Component: Token })
      }
      annotations.forEach((annotation) =>
        stack.push({ Component: Token, annotation }),
      )
    }
  })
  return stack
}
