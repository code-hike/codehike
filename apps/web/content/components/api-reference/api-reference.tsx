import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible"
import {
  Block,
  CodeBlock,
  parseProps,
} from "codehike/blocks"
import { z } from "zod"
import { Pre, highlight } from "codehike/code"

const PropertyBlockSchema = Block.extend({
  blocks: z.array(Block).optional(),
})

const ContentSchema = Block.extend({
  code: CodeBlock,
  main: Block.extend({
    blocks: z.array(PropertyBlockSchema),
  }),
  extra: Block.extend({
    blocks: z.array(PropertyBlockSchema),
  }),
  returns: Block.optional(),
})

type Content = z.infer<typeof ContentSchema>

export async function APIReference({
  hike,
}: {
  hike: unknown
}) {
  const { main, extra, returns, code } = parseProps(
    hike,
    ContentSchema,
  )

  return (
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
        <section>
          <h3 className="mt-8 border-b border-zinc-700">
            {extra.title}
          </h3>
          {extra.blocks.map((property, i) => (
            <CollapsibleProperty
              property={property}
              key={i}
            />
          ))}
        </section>
        {/* Returns */}
        {returns && (
          <div>
            <h3 className="mt-8 border-b border-zinc-700">
              Returns
            </h3>
            {returns.children}
          </div>
        )}
      </div>
      <div className="not-prose max-w-sm w-full">
        <div className="sticky top-16">
          <Code codeblock={code} />
        </div>
      </div>
    </div>
  )
}

function Property({ property }: { property: any }) {
  const [name, ...rest] = property.title.split(" ")
  const type = rest.join(" ")

  return (
    <div className="mb-6">
      <h4>
        <span className="font-mono">{name}</span>
        <span className="ml-2 text-sm text-slate-400">
          {type}
        </span>
      </h4>
      {property.children}
      <ChildProperties properties={property.blocks} />
    </div>
  )
}

function CollapsibleProperty({
  property,
}: {
  property: any
}) {
  const [name, ...rest] = property.title.split(" ")
  const type = rest.join(" ")

  return (
    <Collapsible className="mb-4">
      <CollapsibleTrigger className="font-bold font-mono">
        <div
          className={
            "inline-block mr-1 -ml-3 " +
            "[[data-state=open]_&]:rotate-90 transform transition-transform"
          }
        >
          {">"}
        </div>
        <span>{name}</span>
        <span className="ml-2 text-sm text-slate-400">
          {type}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {property.children}
        <ChildProperties properties={property.blocks} />
      </CollapsibleContent>
    </Collapsible>
  )
}

function ChildProperties({
  properties,
}: {
  properties?: any[]
}) {
  if (!properties || properties.length === 0) return null
  return (
    <Collapsible className="rounded-xl border border-zinc-300/20 px-4 py-1">
      <CollapsibleTrigger className="select-none text-zinc-400 hover:text-zinc-50">
        <div className="[[data-state=open]_&]:hidden">
          Show child attributes
        </div>
        <div className="[[data-state=closed]_&]:hidden">
          Hide child attributes
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {properties.map((property, i) => (
          <Property property={property} key={i} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

async function Code({
  codeblock,
}: {
  codeblock: Content["code"]
}) {
  const info = await highlight(codeblock, "github-dark")
  return (
    <div className="border border-zinc-300/20 rounded mb-8 bg-zinc-900">
      <div className="items-center bg-zinc-800 p-2 pl-4 text-xs flex text-zinc-100">
        <span>{codeblock.meta}</span>
      </div>
      <Pre code={info} className="p-2 overflow-auto" />
    </div>
  )
}
