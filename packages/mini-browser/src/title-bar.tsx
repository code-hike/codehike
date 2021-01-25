import React from "react"
import { Back, Forward, Open } from "./buttons"
import { FrameButtons } from "@code-hike/mini-frame"

import { Classes } from "@code-hike/utils"

export { TitleBar }

function TitleBar({
  url,
  linkUrl,
  classes,
}: {
  url: string
  linkUrl: string
  classes: Classes
}) {
  return (
    <>
      <FrameButtons classes={classes} />
      <Back />
      <Forward />
      {/* <Refresh /> */}
      <input value={url || ""} readOnly />
      <Open href={linkUrl} />
    </>
  )
}
