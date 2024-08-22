import { highlight } from "codehike/code"
import { Block, CodeBlock, ImageBlock, parseProps } from "codehike/blocks"
import { z } from "zod"
import theme from "@/theme.mjs"
import { HighCode } from "../code"

const ContentSchema = z.object({
  code: CodeBlock,
  notes: z
    .array(
      Block.extend({
        code: CodeBlock.optional(),
      }),
    )
    .optional(),
})

export async function CodeWithNotes(props: unknown) {
  const { code, notes = [] } = parseProps(props, ContentSchema)
  const highlighted = await highlight(code, theme)

  // find matches between annotations and notes
  // and add the note as data to the annotation
  highlighted.annotations = await Promise.all(
    highlighted.annotations.map(async (a) => {
      const note = notes.find((n) => a.query && n.title === a.query)
      if (!note) return a

      let children = note.children
      if (note.code) {
        const highlighted = await highlight(note.code, theme)
        children = (
          <HighCode highlighted={highlighted} className="border-none my-0" />
        )
      }

      return {
        ...a,
        data: {
          ...a.data,
          children,
        },
      }
    }),
  )

  return <HighCode highlighted={highlighted} />
}
