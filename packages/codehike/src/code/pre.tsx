import { forwardRef } from "react"
import {
  AnnotationHandler,
  CodeAnnotation,
  InlineProps,
  PreComponent,
  Tokens,
  isBlockAnnotation,
  isInlineAnnotation,
} from "./types.js"
import { AddRefIfNedded } from "./pre-ref.js"
import { renderLines } from "./block.js"
import { toLineGroups, toLines } from "./lines.js"
import { InnerPre } from "./inner.js"

export const Inline = ({ code, ...rest }: InlineProps) => {
  let { tokens } = code
  if (!tokens) {
    throw new Error(
      "Missing tokens in inline code. Use the `highlight` function to generate the tokens.",
    )
  }

  return (
    <code {...rest}>
      {tokens.map((t, i) => {
        if (typeof t === "string") {
          return t
        }
        const [value, color, rest = {}] = t
        return (
          <span key={i} style={{ color, ...rest }}>
            {value}
          </span>
        )
      })}
    </code>
  )
}

export const Pre: PreComponent = forwardRef(
  ({ code, handlers = [], ...rest }, ref) => {
    let { tokens, themeName, lang, annotations } = code

    if (!tokens) {
      throw new Error(
        "Missing tokens in code block. Use the `highlight` function to generate the tokens.",
      )
    }

    handlers
      .filter((c) => c.transform)
      .forEach((c) => {
        annotations = annotations.flatMap((a) =>
          c.name != a.name ? a : c.transform!(a as any) || [],
        )
      })

    const annotationNames = new Set(annotations.map((a) => a.name))
    const hs = handlers.filter(
      (h) => !h.onlyIfAnnotated || annotationNames.has(h.name),
    )

    const stack = buildPreStack(hs)
    const merge = { _stack: stack, _ref: ref as any }
    return (
      <InnerPre merge={merge} data-theme={themeName} data-lang={lang} {...rest}>
        <PreContent tokens={tokens} handlers={hs} annotations={annotations} />
      </InnerPre>
    )
  },
)

function PreContent({
  tokens,
  handlers,
  annotations,
}: {
  tokens: Tokens
  handlers: AnnotationHandler[]
  annotations: CodeAnnotation[]
}) {
  const lines = toLines(tokens)
  const blockAnnotations = annotations.filter(isBlockAnnotation)
  const inlineAnnotations = annotations.filter(isInlineAnnotation)
  const groups = toLineGroups(lines, blockAnnotations)
  return renderLines({
    linesOrGroups: groups,
    handlers,
    inlineAnnotations,
  })
}

function buildPreStack(handlers: AnnotationHandler[]) {
  const noRefStack = handlers.map(({ Pre }) => Pre!).filter(Boolean)
  const refStack = handlers.map(({ PreWithRef }) => PreWithRef!).filter(Boolean)
  if (refStack.length > 0) {
    refStack.unshift(AddRefIfNedded as any)
  }
  return [...noRefStack, ...refStack]
}
