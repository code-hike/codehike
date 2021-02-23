import React from "react"
import { useClasser } from "@code-hike/classer"
import {
  CodeProps,
  HikeProps,
  HikeProvider,
  PreviewProps,
  useHikeContext,
} from "./hike-context"
import {
  DemoProvider,
  useCodeProps,
  usePreviewProps,
} from "./demo-context"
import { Code } from "./code"
import { Preview } from "./preview"

export { FixedLayout, CodeSlot, PreviewSlot }

function FixedLayout({ steps, ...props }: HikeProps) {
  const c = useClasser("ch")

  return (
    <HikeProvider value={{ layout: "fixed" }}>
      <section
        className={c("hike", "hike-fixed")}
        {...props}
      >
        {steps.map((step, index) => (
          <DemoProvider
            codeProps={step.codeProps}
            previewProps={step.previewProps}
            key={index}
          >
            <div className={c("hike-step")}>
              {step.content}
            </div>
          </DemoProvider>
        ))}
      </section>
    </HikeProvider>
  )
}

function CodeSlot(props: CodeProps) {
  const { layout } = useHikeContext()
  return layout === "fixed" ? (
    <CodeSlotContent {...props} />
  ) : null
}

function CodeSlotContent({
  style,
  ...slotProps
}: CodeProps) {
  const c = useClasser("ch-hike")
  const stepCodeProps = useCodeProps()
  const props = {
    minColumns: 46,
    ...stepCodeProps,
    ...slotProps,
  }
  return (
    <div className={c("step-code")} style={style}>
      <Code {...props} />
    </div>
  )
}

function PreviewSlot(props: PreviewProps) {
  const { layout } = useHikeContext()
  return layout === "fixed" ? (
    <PreviewSlotContent {...props} />
  ) : null
}

function PreviewSlotContent({
  style,
  ...slotProps
}: PreviewProps) {
  const c = useClasser("ch-hike")
  const stepPreviewProps = usePreviewProps()
  const props = {
    ...stepPreviewProps,
    ...slotProps,
  }
  return (
    <div className={c("step-preview")} style={style}>
      <Preview {...props} />
    </div>
  )
}
