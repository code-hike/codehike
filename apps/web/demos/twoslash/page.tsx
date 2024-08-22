import { RawCode, Pre, highlight, AnnotationHandler } from "codehike/code"
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "@/components/ui/tooltip"
import Content from "./content.md"
import { createTwoslasher } from "twoslash"

export default function Page() {
  return <Content components={{ Code }} />
}

const twoslasher = createTwoslasher({
  fsMap: new Map(),

  compilerOptions: {
    lib: ["dom"],
    types: ["react"],
  },
})

async function Code({ codeblock }: { codeblock: RawCode }) {
  const value = codeblock.value
  const result = twoslasher(
    // TODO fix https://github.com/twoslashes/twoslash/issues/30
    value.replace(/\r/g, ""),
    codeblock.lang,
  )

  const { hovers, code, queries, completions, errors } = result

  const data = { ...codeblock, value: code }
  const info = await highlight(data, "github-dark")

  hovers.forEach(({ text, line, character, length }) => {
    info.annotations.push({
      name: "hover",
      query: text,
      lineNumber: line + 1,
      fromColumn: character + 1,
      toColumn: character + length,
    })
  })

  queries.forEach(({ text, line, character, length }) => {
    info.annotations.push({
      name: "query",
      query: text,
      fromLineNumber: line + 1,
      toLineNumber: line + 1,
      data: { character },
    })
  })

  // completions.forEach(
  //   ({ line, character, completions }) => {
  //     const names = completions.map((c) => c.name)
  //     console.log(names)
  //   },
  // )

  errors.forEach(({ text, line, character, length }) => {
    info.annotations.push({
      name: "query",
      query: text,
      fromLineNumber: line + 1,
      toLineNumber: line + 1,
      data: { character, className: "text-red-400" },
    })
  })

  return (
    <Pre className="m-0 bg-zinc-950/80" code={info} handlers={[hover, query]} />
  )
}

const hover: AnnotationHandler = {
  name: "hover",
  Inline: async ({ children, annotation }) => {
    const { query, data } = annotation
    const highlighted = await highlight(
      { value: query, lang: "ts", meta: "" },
      "github-dark",
    )
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger className="underline decoration-dashed cursor-pointer">
            {children}
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-900" sideOffset={0}>
            <Pre code={highlighted} className="m-0 p-1 bg-transparent" />
            <TooltipArrow className="fill-zinc-800" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
}

const query: AnnotationHandler = {
  name: "query",
  Block: ({ annotation, children }) => {
    const { character, className } = annotation.data
    return (
      <>
        {children}
        <div
          style={{ minWidth: `${character + 4}ch` }}
          className={
            "w-fit border bg-zinc-900 border-current rounded px-2 relative -ml-[1ch] mt-1 whitespace-break-spaces" +
            " " +
            className
          }
        >
          <div
            style={{ left: `${character + 1}ch` }}
            className="absolute border-l border-t border-current w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px] bg-zinc-900"
          />
          {annotation.query}
        </div>
      </>
    )
  },
}
