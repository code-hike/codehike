import { Block, parseProps } from "codehike/blocks"
import {
  Selectable,
  Selection,
  SelectionProvider,
} from "codehike/utils/selection"
import { z } from "zod"
import { data } from "./the-curse-of-markdown.steps"
import { cn } from "@/lib/utils"
import React from "react"

function Chart({ data }: { data: any }) {
  const points = data.points

  return (
    <div className="relative h-full w-full">
      <Wasteland wallClassName={data.wall} />
      {points.map((point: any, i: number) => (
        <Point key={i} {...point} index={i} extraClassName={data.extra} />
      ))}
      <Screenshots lean={data.leanScreenshot} rich={data.richScreenshot} />
      <Axis cost={data.costAxis} rich={data.richAxis} />
    </div>
  )
}

function Wasteland({ wallClassName = "" }: { wallClassName: string }) {
  return (
    <div
      className={cn(
        "absolute bg-black opacity-10 transition-all left-[55%] right-[44%] top-[50%] bottom-[50%]",
        wallClassName,
      )}
    />
  )
}

function Screenshots({ lean, rich }: { lean?: string; rich?: string }) {
  return (
    <>
      <div
        className={cn(
          "bg-teal-600 w-0.5 absolute transition-all duration-500 opacity-0",
          lean,
        )}
        style={{
          top: "45%",
          bottom: "50%",
          left: "10%",
          translate: "-50% 0",
        }}
      />
      <div
        className={cn(
          "absolute bg-white rounded overflow-hidden transition-all duration-500 opacity-0 border border-teal-700",
          lean,
        )}
        style={{
          bottom: "55%",
          left: "5%",
          top: "10%",
          right: "5%",
        }}
      >
        <img
          src="/blog/curse/nat.org.png"
          alt="nat.org screenshot"
          className="w-full h-full object-cover m-0"
        />
      </div>
      <div
        className={cn(
          "bg-pink-600 w-0.5 absolute transition-all duration-500 opacity-0",
          rich,
        )}
        style={{
          top: "50%",
          bottom: "45%",
          left: "90%",
          translate: "-50% 0",
          transitionDelay: "160ms",
        }}
      />
      <div
        className={cn(
          "absolute bg-white rounded overflow-hidden transition-all duration-500 opacity-0 border border-pink-700",
          rich,
        )}
        style={{
          bottom: "10%",
          left: "5%",
          top: "55%",
          right: "5%",
        }}
      >
        <img
          src="/blog/curse/tailwindcss.com.png"
          alt="nat.org screenshot"
          className="w-full h-full object-cover m-0"
        />
      </div>
    </>
  )
}

function Axis({ cost, rich }: { cost?: string; rich?: string }) {
  return (
    <>
      <div className={cn("transition-all", rich)}>
        <div
          className="absolute bottom-2 left-2 right-3 h-0.5 bg-zinc-900 dark:bg-zinc-100"
          style={{ translate: "0 50%" }}
        />
        <div
          className="border-zinc-900 dark:border-zinc-100 absolute right-2 bottom-2"
          style={{
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderLeftWidth: "6px",
            translate: "0 50%",
          }}
        />
        <div className="absolute bottom-3 right-2 text-sm text-zinc-900 dark:text-zinc-100">
          Richness
        </div>
      </div>
      <div className={cn("transition-all", cost)}>
        <div
          className="absolute top-3 left-2 bottom-2 w-0.5 bg-zinc-900 dark:bg-zinc-100"
          style={{ translate: "-50% 0" }}
        />
        <div
          className="border-zinc-900 dark:border-zinc-100 absolute top-2 left-2"
          style={{
            width: 0,
            height: 0,
            // marginLeft: "-3px",
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderBottomWidth: "6px",
            translate: "-50% 0",
          }}
        />
        <div className="absolute top-1 left-5 text-sm text-zinc-900 dark:text-zinc-100">
          Cost
        </div>
      </div>
    </>
  )
}

function Point({
  rich,
  cost,
  pop,
  index,
  className,
  extraClassName,
}: {
  rich: number
  cost: number
  name: string
  pop: any[]
  className?: string
  extraClassName: string
  index: number
}) {
  const extra = pop.map(({ rich, cost }, i) => (
    <RandomOpacity>
      <div
        key={i}
        data-extra="true"
        style={{
          left: `${rich}%`,
          bottom: `${cost}%`,
          translate: "-50% 50%",
          transitionDelay: `${index * 33}ms`,
          animationDelay: `${i * 100}ms`,
          animationDuration: `${300}ms`,
          animationIterationCount: 1,
          animationFillMode: "both",
        }}
        className={cn(
          "absolute bg-gray-300 rounded-full transition-all ease-in-out size-[3px]",
          className,
          extraClassName,
        )}
      />
    </RandomOpacity>
  ))
  return (
    <>
      {extra}
      <div
        key="main"
        data-main="true"
        style={{
          left: `${rich}%`,
          bottom: `${cost}%`,
          translate: "-50% 50%",
          transitionDelay: `${index * 20}ms`,
        }}
        className={cn(
          "absolute w-2 h-2 bg-white rounded-full transition-all z-10",
          className,
        )}
      />
    </>
  )
}

function RandomOpacity({ children }: { children: React.ReactNode }) {
  const opacity = React.useMemo(() => Math.random() * 0.5 + 0.2, [])
  return <div style={{ opacity }}>{children}</div>
}

export function Layout(props: unknown) {
  const { steps } = parseProps(props, Block.extend({ steps: z.array(Block) }))
  return (
    <>
      <div className="md:hidden">
        <SmallLayout steps={steps} />
      </div>
      <div className="hidden md:block">
        <ScrollyLayout steps={steps} />
      </div>
    </>
  )
}

function SmallLayout({
  steps,
}: {
  steps: {
    children?: React.ReactNode
  }[]
}) {
  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, i) => (
        <div key={i}>
          <div
            className="h-96 w-[324px] max-w-full relative mx-auto bg-[url(/dark-grid.svg)] dark:bg-[#e6edff05] bg-white rounded"
            style={{ backgroundPosition: "center", backgroundSize: "26px" }}
          >
            <Chart data={data[i]} />
          </div>
          {step.children}
        </div>
      ))}
    </div>
  )
}

function ScrollyLayout({
  steps,
}: {
  steps: {
    children?: React.ReactNode
  }[]
}) {
  return (
    <SelectionProvider
      className="hidden md:flex gap-6 relative mb-[max(calc(100vh-788px),64px)]"
      rootMargin={{ top: 256 + 48 * 3, height: 48 }}
    >
      <div className="flex-1">
        <div
          className="top-64 sticky h-96 flex-1 rounded bg-[url(/grid.svg)] dark:bg-[url(/dark-grid.svg)] dark:bg-[#e6edff05] bg-zinc-300/10 flex items-center justify-center"
          style={{
            backgroundPosition: "center",
            backgroundSize: "26px",
          }}
        >
          <Selection
            from={steps.map((step, i) => (
              <Chart data={data[i]} />
            ))}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            className="h-96 data-[selected=true]:opacity-100 opacity-20 transition-opacity scroll-mt-64 [&>:first-child]:mt-0 flex items-center " // snap-start
            selectOn={["scroll"]}
          >
            <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0 prose-h3:scroll-m-64">
              {step.children}
            </div>
          </Selectable>
        ))}
      </div>
    </SelectionProvider>
  )
}

export function RainbowList({ children }: { children: React.ReactNode }) {
  return (
    <div className="[&>:nth-child(1)]:marker:text-cyan-500 [&>:nth-child(2)]:marker:text-blue-500 [&>:nth-child(3)]:marker:text-indigo-500 [&>:nth-child(4)]:marker:text-purple-500 [&>:nth-child(5)]:marker:text-fuchsia-500">
      {children}
    </div>
  )
}
