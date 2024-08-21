import {
  Block,
  CodeBlock,
  parseRoot,
} from "codehike/blocks"
import Content from "./content.md"
import { z } from "zod"
import {
  Selection,
  SelectionProvider,
} from "codehike/utils/selection"
import { Pre, RawCode, highlight } from "codehike/code"
import { Controls } from "./controls"
import { tokenTransitions } from "@/components/annotations/token-transitions"

const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock })),
})

export default function Page() {
  const { steps } = parseRoot(Content, Schema)
  return (
    <SelectionProvider>
      <Selection
        from={steps.map((step) => (
          <Code codeblock={step.code} />
        ))}
      />
      <Controls length={steps.length} />
      <div className="px-4">
        <Selection
          from={steps.map((step) => step.children)}
        />
      </div>
    </SelectionProvider>
  )
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(
    codeblock,
    "github-dark",
  )
  return (
    <Pre
      code={highlighted}
      className="min-h-[15rem] !bg-zinc-900 m-0 mb-4 rounded-none p-2"
      handlers={[tokenTransitions]}
    />
  )
}
