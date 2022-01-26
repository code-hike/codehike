import React from "react"
import { Back, Forward, Open } from "./buttons"
import { FrameButtons } from "@code-hike/mini-frame"
import { EditorTheme } from "@code-hike/utils"

export { TitleBar }

function TitleBar({
  url,
  linkUrl,
  theme,
}: {
  url: string
  linkUrl: string
  theme: EditorTheme
}) {
  return (
    <>
      <FrameButtons />
      <Back />
      <Forward />
      {/* <Refresh /> */}
      <input value={url || ""} readOnly />
      <Open href={linkUrl} />
    </>
  )
}
