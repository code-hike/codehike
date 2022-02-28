import React from "react"
import {
  EditorTheme,
  getColor,
  transparent,
  ColorName,
  Code,
} from "@code-hike/utils"

export function InlineCode({
  className,
  codeConfig,
  children,
  code,
  ...rest
}: {
  className: string
  code: Code
  children?: React.ReactNode
  codeConfig: { theme: EditorTheme }
}) {
  const { theme } = codeConfig
  const { lines } = code
  const allTokens = lines.flatMap(line => line.tokens)
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
        {allTokens.map((token, j) => (
          <span key={j} {...token.props}>
            {token.content}
          </span>
        ))}
      </code>
    </span>
  )
}
