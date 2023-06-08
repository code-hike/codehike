import React from "react"
import { Code } from "../utils"

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
  codeConfig: { themeName: string }
}) {
  const { lines } = code
  const allTokens = lines.flatMap(line => line.tokens)

  return (
    <span
      data-ch-theme={codeConfig.themeName}
      className={
        "ch-inline-code not-prose" +
        (className ? " " + className : "")
      }
      {...rest}
    >
      <code>
        {allTokens.map((token, j) => (
          <span key={j} {...token.props}>
            {token.content}
          </span>
        ))}
      </code>
    </span>
  )
}
