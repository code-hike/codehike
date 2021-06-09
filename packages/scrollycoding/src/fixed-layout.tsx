import React from "react"
import {
  HikeStep,
  HikeProvider,
  useHikeContext,
} from "./hike-context"
import { useClasser } from "@code-hike/classer"
import {
  DemoProvider,
  useEditorProps,
  usePreviewProps,
} from "./demo-provider"
import { EditorProps, Editor } from "./editor"
import { PreviewProps, Preview } from "./preview"

export { FixedLayout, CodeSlot, PreviewSlot }

function FixedLayout({ steps }: { steps: HikeStep[] }) {
  const c = useClasser("ch")

  return (
    <HikeProvider value={{ layout: "fixed" }}>
      <section className={c("hike", "hike-fixed")}>
        {steps.map((step, index) => (
          <DemoProvider
            editorProps={step.editorProps}
            previewProps={step.previewProps}
            previewPreset={step.previewPreset}
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

function CodeSlot(props: EditorProps & { style?: any }) {
  const { layout } = useHikeContext()
  return layout === "fixed" ? (
    <CodeSlotContent {...props} />
  ) : null
}

function CodeSlotContent({
  style,
  ...slotProps
}: EditorProps & { style?: any }) {
  const c = useClasser("ch-hike")
  const stepEditorProps = useEditorProps()
  const props = {
    ...stepEditorProps,
    ...slotProps,
  }
  return (
    <div className={c("step-code")} style={style}>
      <Editor {...props} />
    </div>
  )
}

function PreviewSlot(
  props: PreviewProps & { style?: any }
) {
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
