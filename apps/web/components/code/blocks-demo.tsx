import { parseProps, Block, CodeBlock } from "codehike/blocks"

import {
  AnnotationHandler,
  InnerLine,
  Pre,
  RawCode,
  highlight,
} from "codehike/code"
import theme from "@/theme.mjs"
import { pill } from "../annotations/pill"
import { ruler } from "../annotations/ruler"
import { z } from "zod"
import { HighCode } from "../code"

export async function BlocksDemo(props: unknown) {
  const { content, component, result, caption } = parseProps(
    props,
    Block.extend({
      caption: z.string().optional(),
      content: CodeBlock,
      component: CodeBlock,
      result: CodeBlock,
    }),
  )

  const resultChildren = <CalloutCode code={result} />
  return (
    <figure className="ruler-group m-0">
      <div className="flex gap-2 items-stretch w-full flex-wrap">
        <div className="min-w-72 flex-1 ">
          <CodeWithNotes code={content} />
        </div>
        <div className="min-w-72 flex-1 min-h-full">
          <CodeWithNotes
            code={component}
            notes={{
              result: { children: resultChildren },
            }}
          />
        </div>
      </div>
      {caption && (
        <figcaption className="text-sm pt-2 text-center opacity-70">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export async function CodeWithNotes({
  code,
  notes = {},
}: {
  code: RawCode
  notes?: Record<string, { children: React.ReactNode }>
}) {
  const highlighted = await highlight(code, theme)

  highlighted.annotations = highlighted.annotations.map((a) => {
    const note = notes[a.query]
    if (!note) return a
    return {
      ...a,
      data: {
        ...a.data,
        children: note.children,
      },
    }
  })

  return <HighCode className="min-h-full" highlighted={highlighted} />
}

async function CalloutCode({ code }: { code: RawCode }) {
  const highlighted = await highlight(code, theme)
  return (
    <Pre
      code={highlighted}
      className="m-0 py-1 px-0 bg-transparent"
      handlers={[ruler, lineHandler, pill]}
    />
  )
}

const lineHandler: AnnotationHandler = {
  name: "line",
  Line: (props) => {
    return <InnerLine merge={props} className="px-3" />
  },
}
