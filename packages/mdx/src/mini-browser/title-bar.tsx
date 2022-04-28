import React from "react"
import { Back, Forward, Open } from "./buttons"
import { FrameButtons } from "../mini-frame"
import { EditorTheme, getColor, ColorName } from "../utils"

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
  const inputBorder = getColor(theme, ColorName.InputBorder)
  return (
    <>
      <FrameButtons />
      <Back />
      <Forward />
      {/* <Refresh /> */}
      <input
        value={url || ""}
        readOnly
        style={{
          background: getColor(
            theme,
            ColorName.InputBackground
          ),
          color: getColor(theme, ColorName.InputForeground),
          border: inputBorder
            ? `1px solid ${inputBorder}`
            : undefined,
        }}
      />
      <Open
        href={linkUrl}
        style={{
          color: getColor(
            theme,
            ColorName.EditorForeground
          ),
        }}
      />
    </>
  )
}
