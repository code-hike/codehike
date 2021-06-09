import {
  DemoProvider,
  PreviewPreset,
} from "./demo-provider"
import { EditorProps, Editor } from "./editor"
import { PreviewProps, Preview } from "./preview"
import { useClasser } from "@code-hike/classer"
import React from "react"

type StickerColumnProps = {
  editorProps: EditorProps
  previewProps: PreviewProps
  previewPreset: PreviewPreset
  noPreview: boolean
}

export { StickerColumn }

function StickerColumn({
  editorProps,
  previewProps,
  previewPreset,
  noPreview,
}: StickerColumnProps) {
  const c = useClasser("ch")
  return (
    <aside className={c("hike-sticker-column")}>
      <div className={c("hike-sticker")}>
        <DemoProvider
          editorProps={editorProps}
          previewProps={previewProps}
          previewPreset={previewPreset}
        >
          <div className={c("hike-editor")}>
            <Editor {...editorProps} />
          </div>
          {noPreview || (
            <div className={c("hike-preview")}>
              <Preview {...previewProps} />
            </div>
          )}
        </DemoProvider>
      </div>
    </aside>
  )
}
