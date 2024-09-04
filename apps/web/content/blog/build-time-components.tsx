import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { z } from "zod"
import { Code } from "@/components/code"
import { Fragment } from "react"
export { BlocksToContext, WithTooltip } from "@/components/blocks-to-context"

export function Chain(props: unknown) {
  const { intro, steps, outro } = parseProps(
    props,
    Block.extend({
      intro: Block.optional(),
      steps: z.array(
        Block.extend({
          code: CodeBlock,
          this: Block.optional(),
          next: Block.optional(),
        }),
      ),
      outro: Block.optional(),
    }),
  )
  return (
    <section className="md:grid grid-cols-2 grid-flow-col gap-2 md:-mx-10 lg:-mx-32 mt-2">
      <div className="col-start-2 flex">
        {intro && (
          <>
            <Arrow intro />
            <div className=" self-center flex-1 min-w-0">{intro?.children}</div>
          </>
        )}
      </div>
      {steps.map((step, i) => (
        <Fragment key={i}>
          <div className="col-start-1 row-span-3 ">
            <Code codeblock={step.code} className="h-full m-0" />
          </div>

          <div className="col-start-2 flex">
            {step.this && (
              <>
                <Arrow />
                <div className=" self-center flex-1 min-w-0">
                  {step.this.children}
                </div>
              </>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className="col-start-2 row-span-2 flex">
              <Arrow />
              <div className=" self-center flex-1 min-w-0">
                {step.next?.children}
              </div>
            </div>
          )}
        </Fragment>
      ))}
      <div className="col-start-2">{outro?.children}</div>
    </section>
  )
}

function Arrow({ intro }: { intro?: boolean }) {
  return (
    <div className="h-full mr-3 flex-col w-5 hidden md:flex">
      {!intro && <div className="h-2 bg-zinc-500/20 rounded-se-2xl mt-6" />}
      <div className="flex-1 w-2 bg-zinc-500/20 self-end" />
      <div className="h-2 bg-zinc-500/20 rounded-ee-2xl ml-2 mb-6">
        <div
          className="border-zinc-500/20 -ml-2"
          style={{
            width: 0,
            height: 0,
            marginTop: "-4px",
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRightWidth: "8px",
          }}
        />
      </div>
    </div>
  )
}

export function Demo({ children }: { children: React.ReactNode }) {
  const preview = (
    <div
      className="min-w-0 rounded flex-1 bg-[url(/dark-grid.svg)] dark:bg-[#e6edff05] bg-[#4c4f57a6] p-3 flex flex-col overflow-hidden border"
      style={{
        backgroundPosition: "center",
        backgroundSize: "24px",
      }}
    >
      <div className="pb-2 text-center text-white dark:text-zinc-200 ">
        Hover the links:
      </div>
      <div className="bg-white/90 p-2 rounded text-zinc-900">
        <h2 className="my-1 text-zinc-900">Hello</h2>
        <p className="mb-0">
          Use{" "}
          <LinkWithCard
            href="https://nextjs.org"
            image="https://assets.vercel.com/image/upload/front/nextjs/twitter-card.png"
          >
            Next.js
          </LinkWithCard>{" "}
          and{" "}
          <LinkWithCard
            href="https://codehike.org/"
            image="https://codehike.org/codehike.png"
          >
            Code Hike
          </LinkWithCard>
        </p>
      </div>
    </div>
  )
  return (
    <div className="flex gap-2 flex-wrap [&>*]:flex-1 [&>*]:min-w-72 ">
      <div className="min-w-0 flex-1 max-h-full [&>*]:my-0">{children}</div>
      {preview}
    </div>
  )
}

function LinkWithCard({
  href,
  children,
  image,
}: {
  href: string
  children: React.ReactNode
  image: string
}) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger
        className="text-zinc-900 decoration-zinc-700"
        href={href}
      >
        {children}
        <img src={image} alt={href} className="hidden" fetchPriority="low" />
      </HoverCardTrigger>
      <HoverCardContent className="p-0 overflow-hidden [&>*]:m-0">
        <img src={image} alt={href} />
      </HoverCardContent>
    </HoverCard>
  )
}
