import { Block, parseProps } from "codehike/blocks"
import { z } from "zod"

export function Usage(props: unknown) {
  const { left, right, caption } = parseProps(
    props,
    Block.extend({ left: Block, right: Block, caption: Block.optional() }),
  )
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-1 min-w-0 flex flex-col [&>*]:m-0 [&>*]:grow gap-2">
          {left.children}
        </div>
        <div className="flex-1 min-w-0 flex flex-col [&>*]:m-0 [&>*]:grow gap-2">
          {right.children}
        </div>
      </div>
      <div className="text-center text-sm opacity-80">{caption?.children}</div>
    </div>
  )
}
