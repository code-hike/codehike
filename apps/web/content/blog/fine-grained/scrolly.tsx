import { z } from "zod"
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection"
import { CodeBlock } from "codehike/blocks"
import { Block, parseProps } from "codehike/blocks"
import { Code } from "./code"

const StepSchema = Block.extend({
  page: CodeBlock,
  content: CodeBlock,
  after: Block.optional(),
})

const Schema = Block.extend({
  blocks: z.array(StepSchema),
})

export function Hover({ children }: { children: React.ReactNode }) {
  return (
    <span
    // className="underline decoration-dotted underline-offset-2 hover:text-white"
    >
      {children}
    </span>
  )
}

const stickerHeight = 640

export function Scrolly(props: unknown) {
  const p = parseProps(props, Schema)
  return (
    <>
      <Lean {...p} />
      <Rich {...p} />
    </>
  )
}

type ContentProps = z.infer<typeof Schema>
function Lean(props: ContentProps) {
  const { blocks } = props
  return (
    <div className="md:hidden">
      {blocks.map((step, i) => (
        <section key={i}>
          {step.children}
          <Code codeblock={step.content} />
          <Code codeblock={step.page} />
          <Preview i={i} />
          {step.after?.children}
        </section>
      ))}
      <hr />
    </div>
  )
}

function Rich(props: ContentProps) {
  const { blocks } = props
  return (
    <SelectionProvider
      className="hidden md:block gap-4 relative ruler-group"
      rootMargin="-96px 0px"
    >
      <div className="top-20 sticky">
        <Selection
          from={blocks.map((step, i) => (
            <Sticker step={step} index={i} />
          ))}
        />
      </div>
      <div
        className="flex-1 min-w-0 flex flex-col gap-[calc(100vh-7rem)]"
        style={{ paddingTop: 32, paddingBottom: stickerHeight }}
      >
        {blocks.map((step, i) => (
          <StepMessage key={i} index={i} step={step} />
        ))}
      </div>
    </SelectionProvider>
  )
}

function StepMessage({ step, index }: { step: Step; index: number }) {
  return (
    <Selectable
      index={index}
      selectOn={["scroll"]}
      className="z-10 data-[selected=true]:opacity-100 opacity-50 transition-opacity duration-300 border border-[var(--ch-23)] rounded bg-[var(--ch-22)] px-4 mx-12 prose-h3:mt-4"
    >
      {step.children}
      {step.after?.children}
    </Selectable>
  )
}

type Step = z.infer<typeof StepSchema>
function Sticker({ step, index }: { step: Step; index: number }) {
  return (
    <div className="flex gap-2" style={{ height: stickerHeight }}>
      <Code className="my-0 flex flex-col flex-1" codeblock={step.page} />
      <div className="flex flex-col flex-1 gap-2">
        <Code className="my-0 flex flex-col flex-1" codeblock={step.content} />
        <Preview i={index} />
      </div>
    </div>
  )
}

function Preview({ i }: { i: number }) {
  return (
    <div className="h-52 rounded p-2 bg-blue-900/80 bg-[url(/dark-grid.svg)] text-white">
      {previews[i]}
    </div>
  )
}

const previews = [
  <div className="flex gap-2 h-full prose-invert">
    <div className="bg-teal-500/40 rounded p-2">sidebar</div>
    <div className="bg-pink-500/40 rounded p-2 flex-1">{"<Content/>"}</div>
  </div>,
  <div className="flex gap-2 h-full prose-invert">
    <div className="bg-teal-500/40 rounded p-2">sidebar</div>
    <main className="flex-1 flex flex-col gap-2">
      <div className="bg-pink-500/40 rounded p-2">{"<h1/>"}</div>
      <div className="bg-pink-500/40 rounded p-2 flex-1">{"<Content/>"}</div>
    </main>
  </div>,
  <div className="flex gap-2 h-full prose-invert">
    <div className="bg-teal-500/40 rounded p-2">sidebar</div>
    <main className="flex-1 flex flex-col gap-2">
      <div className="bg-pink-500/40 rounded p-2 h-14">intro</div>
      <div className="flex gap-2 flex-1">
        <div className="bg-pink-500/40 rounded p-2 flex-1">step one</div>
        <div className="bg-pink-500/40 rounded p-2 flex-1">step two</div>
        <div className="bg-pink-500/40 rounded p-2 flex-1">step three</div>
      </div>
    </main>
  </div>,
  <div className="flex gap-2 h-full prose-invert">
    <div className="bg-teal-500/40 rounded p-2">sidebar</div>
    <main className="flex-1 flex flex-col gap-2">
      <div className="bg-pink-500/40 rounded p-2 h-14">intro</div>
      <div className="flex gap-2 flex-1">
        <div className="flex-1 flex flex-col rounded overflow-hidden">
          <div className="bg-pink-500/60 px-2 py-1">{"<img>"}</div>
          <span className="bg-pink-500/40  flex-1 px-2 py-1">step one</span>
        </div>
        <div className="flex-1 flex flex-col rounded overflow-hidden">
          <div className="bg-pink-500/60 px-2 py-1">{"<img>"}</div>
          <span className="bg-pink-500/40  flex-1 px-2 py-1">step two</span>
        </div>
        <div className="flex-1 flex flex-col rounded overflow-hidden">
          <div className="bg-pink-500/60 px-2 py-1">{"<img>"}</div>
          <span className="bg-pink-500/40  flex-1 px-2 py-1">step three</span>
        </div>
      </div>
    </main>
  </div>,
  <div className="flex gap-2 h-full prose-invert">
    <div className="bg-teal-500/40 rounded p-2">sidebar</div>
    <main className="flex-1 flex flex-col gap-2">
      <div className="bg-pink-500/40 rounded p-2 h-14">intro</div>
      <div className="flex gap-2 flex-1">
        <div className="flex-1 flex flex-col rounded overflow-hidden">
          <div className="bg-pink-500/60 px-2 py-1">{"<img>"}</div>
          <span className="bg-pink-500/40  flex-1 px-2 py-1">step one</span>
        </div>
        <div className="flex-1 flex flex-col rounded overflow-hidden">
          <div className="bg-pink-500/60 px-2 py-1">{"<img>"}</div>
          <span className="bg-pink-500/40  flex-1 px-2 py-1">step two</span>
        </div>
        <div className="flex-1 flex flex-col rounded overflow-hidden">
          <div className="bg-pink-500/60 px-2 py-1">{"<img>"}</div>
          <span className="bg-pink-500/40  flex-1 px-2 py-1">step three</span>
        </div>
      </div>
    </main>
  </div>,
  <div className="h-full">
    <main className="border-t-4 border-red-600 bg-white p-2 rounded">
      <h2 className="text-black my-2 text-base">Unhandled Error</h2>
      <p className="text-red-600 text-sm font-mono">
        Error at:
        <br />
        ## !!steps Step one
        <br />
        missing `cover`
      </p>
    </main>
  </div>,
]
