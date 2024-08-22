import { Slides, Controls } from "./slides"
import { Pre, RawCode, highlight } from "codehike/code"

export function Slideshow({ hike }: { hike: any }) {
  return (
    <Slides
      slides={hike.steps.map((step: any) => (
        <div>
          <Controls length={hike.steps.length} />
          <Code codeblock={step.code} />
          <Controls length={hike.steps.length} />
          <div className="h-40 px-6">{step.children}</div>
        </div>
      ))}
    />
  )
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const info = await highlight(codeblock, "github-dark")
  return (
    <Pre
      code={info}
      className="min-h-[40rem] !bg-zinc-900 m-0 rounded-none"
    />
  )
}
