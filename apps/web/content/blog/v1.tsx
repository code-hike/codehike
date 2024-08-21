import { Block, CodeBlock, parseProps } from "codehike/blocks"
import theme from "../../theme.mjs"
import { highlight, Pre } from "codehike/code"
import { Code } from "@/components/code"
import { tooltip } from "@/components/annotations/tooltip"
import { AllSponsors } from "../../app/landing/sponsors"
import { CodeWithNotes } from "../../components/code/code-with-notes"
import { unknown, z } from "zod"

export async function Codeblocks(props: unknown) {
  const { code, preview, content } = parseProps(
    props,
    Block.extend({
      code: CodeBlock,
      preview: CodeBlock,
      content: CodeBlock,
    }),
  )

  const highlightedCode = await highlight(code, theme)
  const highlightedContent = await highlight(content, theme)
  const highlightedPreview = await highlight(preview, "dracula")

  return (
    <section className="flex flex-col-reverse md:flex-row gap-2 items-stretch w-full">
      <div className="flex flex-col gap-2 items-stretch flex-1">
        <Code codeblock={highlightedContent} className="m-0" />
        <div
          className="flex-1 rounded p-2 bg-[url(/dark-grid.svg)] dark:bg-[#e6edff05] bg-[#4c4f57a6] flex items-center justify-center"
          style={{
            backgroundPosition: "center",
            backgroundSize: "26px",
          }}
        >
          <Pre
            code={highlightedPreview}
            className="p-3 text-sm"
            handlers={[tooltip]}
            style={{ background: highlightedPreview.style.background }}
          />
        </div>
      </div>
      <Code codeblock={highlightedCode} className="m-0" />
    </section>
  )
}

export async function FineGrained(props: unknown) {
  const { content, page } = parseProps(
    props,
    Block.extend({
      content: CodeBlock,
      page: z.any(),
    }),
  )

  const highlightedContent = await highlight(content, theme)

  return (
    <section className="md:flex gap-2 items-stretch w-full [&>*]:flex-1">
      <Code codeblock={highlightedContent} />
      <CodeWithNotes {...page} />
    </section>
  )
}

export function Sponsors() {
  return <AllSponsors className="-mx-12 scale-[0.88]" />
}
