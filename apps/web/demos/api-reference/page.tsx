import {
  Block,
  CodeBlock,
  parseRoot,
} from "codehike/blocks"
import Content from "./content.md"
import { z } from "zod"
import { Pre, RawCode, highlight } from "codehike/code"

const Schema = Block.extend({
  resource: Block.extend({
    code: CodeBlock,
    main: Block.extend({
      blocks: z.array(Block),
    }),
    extra: Block.extend({
      blocks: z.array(Block),
    }),
  }),
})

export default function Page() {
  const { resource, children } = parseRoot(Content, Schema)
  const { main, extra, code } = resource
  return (
    <div className="prose prose-invert">
      {children}
      <div>
        <div className="relative flex flex-row gap-12 mb-24">
          <div className="flex-1">
            {/* Main Properties */}
            <section>
              <h3 className="mt-8 border-b border-zinc-700">
                {main.title}
              </h3>
              {main.blocks.map((property, i) => (
                <Property property={property} key={i} />
              ))}
            </section>
            {/* Extra Properties */}
            <section></section>
          </div>
          <div className="not-prose max-w-sm w-full">
            <div className="sticky top-16">
              <Code codeblock={code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(
    codeblock,
    "github-dark",
  )
  return (
    <div className="border border-zinc-300/20 rounded mb-8 bg-zinc-900">
      <div className="items-center bg-zinc-800 p-2 pl-4 text-xs flex text-zinc-100">
        <span>{codeblock.meta}</span>
      </div>
      <Pre
        code={highlighted}
        className="p-2 overflow-auto"
      />
    </div>
  )
}

function Property({ property }: { property: any }) {
  return (
    <div className="mt-4">
      <h4>{property.title}</h4>
      <p>{property.children}</p>
    </div>
  )
}
