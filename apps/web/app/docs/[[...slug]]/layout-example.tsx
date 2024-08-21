import { Block, CodeBlock, parseRoot } from "codehike/blocks"
import { Tab, Tabs } from "next-docs-ui/components/tabs"
import { CopyButton } from "@/components/copy-button"
import { z } from "zod"
import { DependencyTerminal } from "@/ui/dependency-terminal"
import { RawCode, highlight, Pre } from "codehike/code"

const ContentSchema = Block.extend({
  intro: Block,
  mdx: CodeBlock,
  preview: Block,
  code: z.array(CodeBlock),
})

export function LayoutExample({ MDX }: { MDX: any }) {
  const content = parseRoot(MDX, ContentSchema)
  const { intro, mdx, preview, code } = content

  return (
    <>
      {intro.children}
      <Tabs items={["Preview", "MDX", "Code"]}>
        <Tab
          value="Preview"
          className="bg-blue-500/30 mt-0 p-6 bg-[url(/dark-grid.svg)]"
        >
          <div
            className={`border border-primary/50 bg-zinc-950 rounded overflow-hidden ${preview.title}`}
          >
            {preview.children}
          </div>
        </Tab>
        <Tab value="MDX">
          <div className="border border-zinc-300/20 rounded mb-8 bg-zinc-900">
            <div className="items-center bg-zinc-800 p-2 pl-4 text-xs flex text-zinc-100">
              <span>content.mdx</span>
              <CopyButton className="ml-auto" text={mdx.value} />
            </div>
            <MDXCode data={mdx} />
          </div>
        </Tab>
        <Tab value="Code">
          {code.map((codeblock, i) => (
            <Code key={i} codeblock={codeblock} />
          ))}
        </Tab>
      </Tabs>
    </>
  )
}

async function MDXCode({ data }: { data: RawCode }) {
  const info = await highlight(data, "github-dark")
  return <Pre code={info} className="m-0 whitespace-pre-wrap" />
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const c = codeblock
  const info = await highlight(codeblock, "github-dark")
  if (c.meta === "dependencies") {
    return <DependencyTerminal codeblock={c} />
  }
  return (
    <div className="border border-zinc-300/20 rounded mb-8 bg-zinc-900">
      <div className="items-center bg-zinc-800 p-2 pl-4 text-xs flex text-zinc-100">
        <span>{c.meta}</span>
        <CopyButton className="ml-auto" text={c.value} />
      </div>
      <Pre code={info} className="max-h-96 m-0" />
    </div>
  )
}
