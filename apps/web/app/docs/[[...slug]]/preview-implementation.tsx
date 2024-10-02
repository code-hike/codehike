import { Block, parseRoot } from "codehike/blocks"
import React from "react"
import { z } from "zod"
import { Demo } from "@/components/demo"
import { Pre, RawCode, highlight } from "codehike/code"
import { CopyButton } from "@/components/copy-button"
import { ComponentPackLink } from "@/components/component-pack-link"

const ContentSchema = Block.extend({
  demo: Block,
  implementation: Block,
})

export function PreviewImplementation({ MDX }: { MDX: any }) {
  const { demo, implementation } = parseRoot(MDX, ContentSchema, {
    components: { Demo },
  })

  return (
    <>
      {demo.children}
      <h2>Implementation</h2>
      {implementation.children}
    </>
  )
}
