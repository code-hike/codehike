import { Block, CodeBlock, parseRoot } from "codehike/blocks"
import { Code } from "../../components/code"

import CodeContent from "./demo.md"
import localFont from "next/font/local"
import { AnnotationHandler } from "codehike/code"
import { CodeIcon } from "@/components/annotations/icons"

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

const myFont = localFont({
  src: "./placeholdifier.woff2",
  display: "swap",
})
const monoFont = localFont({
  src: "./placeholdifier-monospace.woff2",
  display: "swap",
})

const { content, page } = parseRoot(
  CodeContent,
  Block.extend({ page: CodeBlock, content: CodeBlock }),
)

export function Demo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-12 max-w-3xl mx-auto w-96 md:w-auto px-3 md:px-2">
      <div className="col-span-1 items-center flex">
        <Content />
      </div>
      <div className="col-span-2 md:order-none order-first">
        <Code
          className="min-w-0 m-0 flex-2"
          // style={{ "--bg-color": "--background" } as any}
          codeblock={page}
          extraHandlers={[rainbow, tooltip]}
        />
      </div>
      <div className="col-span-1 items-center flex">
        <Preview>
          <Scrolly />
        </Preview>
      </div>
    </div>
  )
}

function Content() {
  return (
    <div
      className={
        "border border-editorGroup-border rounded overflow-hidden h-72 w-full"
      }
      style={{
        background: "#e6edff25",
        fontSize: "10px",
      }}
    >
      <div className="px-3 py-2 border-b border-editorGroup-border bg-editorGroupHeader-tabsBackground text-sm text-tab-activeForeground flex items-center">
        <CodeIcon title="content.md" />
        <div className="flex gap-1 h-4 items-center ml-2 ">content.md</div>
      </div>
      <pre className={"flex-1 min-w-0 p-2 overflow-hidden "}>
        <div className="rounded -m-1 p-1 px-2 bg-teal-500/40">
          <span className="font-bold">
            ## !intro <span className={""}>Roman Emperors</span>
          </span>
          <br />
          <br />
          <span className={""}>The Roman Empire was ...</span>
          <br />
        </div>
        <br />
        <div className="rounded -m-1 p-1 px-2 bg-sky-500/40">
          <span className="font-bold">
            ## !!emperors <span className={""}>Augustus</span>
          </span>
          <br />
          <br />
          <span className={""}>The founder of the ...</span>
          <br />
          <br />
          <span className={""}>![!img cover](/one.png)</span>
          <br />
          <br />
          ```js !<br />
          console.log(1)
          <br />
          ```
        </div>
        <br />
        <div className="rounded -m-1 p-1 px-2 bg-violet-500/40">
          <span className="font-bold">
            ## !!emperors <span className={""}>Nero</span>
          </span>
          <br />
          <br />
          <span className={""}>Tyrannical ruler ...</span>
          <br />
          <br />
          <span className={""}>![!img cover](/nero.png)</span>
          <br />
          <br />
          ```js !<br />
          ```
        </div>
      </pre>
    </div>
  )
}

const bgs = [
  "bg-green-500/40",
  "bg-teal-500/40",
  "bg-sky-500/40",
  "bg-violet-500/40",
  "bg-fuchsia-500/40",
  "bg-pink-500/40",
]
function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "border border-editorGroup-border rounded overflow-hidden h-72 w-full"
      }
    >
      <div className="px-2 py-2 border-b border-editorGroup-border bg-editorGroupHeader-tabsBackground text-sm text-tab-activeForeground flex">
        <div className="flex gap-1 h-4 items-center">
          <div className="size-[10px] rounded-full bg-slate-600/20  dark:bg-slate-100/20" />
          <div className="size-[10px] rounded-full bg-slate-600/20 dark:bg-slate-100/20" />
          <div className="size-[10px] rounded-full bg-slate-600/20 dark:bg-slate-100/20" />
        </div>
      </div>
      <div
        style={{
          background: "#e6edff25",
          backgroundImage: `url(/dark-grid.svg)`,
          backgroundPosition: "center",
          backgroundSize: "32px",
          fontSize: "8px",
          letterSpacing: "-0.8px",
        }}
        className={"flex-1 min-w-0 p-2 overflow-hidden " + myFont.className}
      >
        {children}
      </div>
    </div>
  )
}

function Scrolly() {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="bg-teal-500/40 rounded p-2 ">
        Roman Emperors
        <p className="opacity-60">The Roman Empire was led ...</p>
      </div>
      <div className="flex-1 flex gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <div className="bg-sky-500/40 rounded p-2">
            <div>Augustus</div>
            <p className="opacity-60">
              The first emperor, established the empire in 27 BC
            </p>
          </div>
          <div className="bg-violet-500/40 rounded p-2">
            <div>Nero</div>
            <p className="opacity-60">
              Tyrannical ruler, known for his cruelty and extravagance
            </p>
          </div>
          <div className="bg-fuchsia-500/40 rounded p-2">
            <div>Trajan</div>
            <p className="opacity-60">
              Renowned for his military conquests and public works
            </p>
          </div>
        </div>
        <div className="bg-sky-500/40 rounded p-2 flex-1 h-40">
          <div className="w-full h-16 bg-gray-500/50 dark:bg-gray-300/50 rounded"></div>
          <pre
            className={
              monoFont.className +
              " bg-slate-100 dark:bg-slate-950 opacity-60 rounded m-0 mt-2 py-1"
            }
          >
            {code}
          </pre>
        </div>
      </div>
    </div>
  )
}

const code = (
  <>
    <div className="border-l-2 border-transparent">
      <div className="px-1">
        <div>
          <span style={{ color: "var(--ch-7)" }}>export</span>{" "}
          <span style={{ color: "var(--ch-5)" }}>Page</span>
          {"\n"}
        </div>
      </div>
    </div>
    <div className="border-l-2 border-transparent">
      <div className="px-1">
        <div>
          {"  "}
          <span style={{ color: "var(--ch-7)" }}>re</span>{" "}
          <span style={{ color: "var(--ch-6)" }}>di</span>{" "}
          <span style={{ color: "var(--ch-7)" }}>re</span>
          {"\n"}
        </div>
      </div>
    </div>
    <div className="border-l-2 border-transparent">
      <div className="px-1">
        <div>
          {"    "}
          <span style={{ color: "var(--ch-6)" }}>div</span>{" "}
          <span style={{ color: "var(--ch-4)" }}>&gt;</span>{" "}
          <span style={{ color: "var(--ch-4)" }}>&gt;</span>
          {"\n"}
        </div>
      </div>
    </div>
    <div className="border-l-2 border-transparent">
      <div className="px-1">
        <div>
          {"    "}
          <span style={{ color: "var(--ch-4)" }}>&lt;</span>{" "}
          <span style={{ color: "var(--ch-7)" }}>Hero</span>{" "}
          <span style={{ color: "var(--ch-5)" }}>re</span>
          {"\n"}
        </div>
      </div>
    </div>
    <div className="border-l-2 border-transparent">
      <div className="px-1">
        <div>
          {"  "}
          <span style={{ color: "var(--ch-5)" }}>re</span>{" "}
          <span style={{ color: "var(--ch-6)" }}>divdiv</span>
          {"\n"}
        </div>
      </div>
    </div>
  </>
)

const rainbow: AnnotationHandler = {
  name: "rainbow",
  Block: ({ annotation, ...props }) => {
    const gradient = annotation?.query
      ? "bg-gradient-to-tr"
      : "bg-gradient-to-br"

    return (
      <div
        className={`${gradient} from-teal-500/20 via-sky-500/20 to-violet-500/20 -my-0.5 py-0.5`}
      >
        {props.children}
      </div>
    )
  },
}

const block: AnnotationHandler = {
  name: "block",
  Block: ({ annotation, ...props }) => {
    const n = Number(annotation?.query || "2") % bgs.length
    const bg = bgs[n]
    return (
      <div className={`${bg} rounded mx-1 my-0.5 overflow-hidden`}>
        {props.children}
      </div>
    )
  },
}

const tooltip: AnnotationHandler = {
  name: "tt",
  Inline: ({ children, annotation }) => {
    const { query, data } = annotation
    return (
      <TooltipProvider>
        <Tooltip delayDuration={50}>
          <TooltipTrigger className="underline decoration-dashed underline-offset-4">
            {children}
          </TooltipTrigger>
          <TooltipContent align="start" side="bottom" className="p-0">
            <Code
              className="m-0 p-0 border-none"
              style={{ fontSize: "13px", lineHeight: "1.2" }}
              codeblock={content}
              extraHandlers={[block]}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
}
