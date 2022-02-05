import React from "react"
import {
  EditorTheme,
  getColor,
  transparent,
  ColorName,
} from "@code-hike/utils"

export function InlineCode({
  className,
  codeConfig,
  children,
  ...rest
}: {
  className: string
  children?: React.ReactNode
  codeConfig: { theme: EditorTheme }
}) {
  const { theme } = codeConfig
  return (
    <span
      className={
        "ch-inline-code not-prose" +
        (className ? " " + className : "")
      }
      {...rest}
    >
      <code
        style={{
          background: transparent(
            getColor(theme, ColorName.CodeBackground),
            0.9
          ),
          color: getColor(theme, ColorName.CodeForeground),
        }}
      >
        {children}
      </code>
    </span>
  )
}
