import { RawCode, Pre, highlight, AnnotationHandler } from "codehike/code"
import Content from "./content.mdx"
import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { z } from "zod"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import theme from "@/theme.mjs"

export default function Page() {
  return <Content components={{ CodeWithTooltips, Code }} />
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, theme)
  return <Pre code={highlighted} className="bg-transparent m-0 p-0" />
}

async function CodeWithTooltips(props: unknown) {
  const { code, tooltips = [] } = parseProps(
    props,
    Block.extend({ code: CodeBlock, tooltips: z.array(Block).optional() }),
  )
  const highlighted = await highlight(code, "github-dark")

  highlighted.annotations = highlighted.annotations.map((a) => {
    const note = tooltips.find((n) => n.title === a.query)
    if (!note) return a
    return {
      ...a,
      data: { ...a.data, children: note.children },
    }
  })
  return (
    <Pre
      className="m-0 px-2 bg-zinc-950/80"
      code={highlighted}
      handlers={[tooltip]}
    />
  )
}

const tooltip: AnnotationHandler = {
  name: "tooltip",
  Inline: ({ children, annotation }) => {
    const { query, data } = annotation
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger className="underline decoration-dashed cursor-pointer">
            {children}
          </TooltipTrigger>
          <TooltipContent
            sideOffset={0}
            align="start"
            alignOffset={-8}
            className="font-sans prose dark:prose-invert prose-p:mb-0"
          >
            {data?.children || query}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
}
