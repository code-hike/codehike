import { RawCode } from "codehike/code"
import { Code as TheCode, extractFlags } from "@/components/code"
import { Block, parseProps } from "codehike/blocks"

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const { flags } = extractFlags(codeblock)

  const style = {} as any
  if (flags.includes("1")) {
    style["--border-color"] = "rgb(96 165 250 / 0.5)"
    style["--bg-color"] = "rgb(96 165 250 / 0.10)"
  } else if (flags.includes("2")) {
    style["--border-color"] = "transparent"
  }

  const className = flags.includes("f") ? "h-full my-0" : "my-0"

  return <TheCode codeblock={codeblock} style={style} className={className} />
}

export function Columns(props: unknown) {
  const { left, right } = parseProps(
    props,
    Block.extend({ left: Block, right: Block }),
  )
  return (
    <div className="flex gap-2  -mx-8">
      <div className="flex-1 min-w-0">{left.children}</div>
      <div className="flex-1 min-w-0">{right.children}</div>
    </div>
  )
}
import { z } from "zod"
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection"
import { CodeBlock } from "codehike/blocks"

const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock })),
})

export function Scrollycoding(props: unknown) {
  const { steps } = parseProps(props, Schema)
  return (
    <SelectionProvider className="flex gap-4 -mx-8">
      <div className="flex-1 min-w-0 mb-[50vh]">
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={["click", "scroll"]}
            className="opacity-50 data-[selected=true]:opacity-100 transition-opacity duration-300"
          >
            {step.children}
          </Selectable>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <div className="top-20 sticky">
          <Selection
            from={steps.map((step) => (
              <TheCode
                codeblock={step.code}
                className="my-0 max-h-[calc(100vh-6rem)] h-screen flex flex-col"
              />
            ))}
          />
        </div>
      </div>
    </SelectionProvider>
  )
}
