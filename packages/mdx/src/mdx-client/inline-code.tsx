import React from "react"
import { Code } from "../utils"

export function InlineCode({
  className,
  globalConfig,
  children,
  code,
  ...rest
}: {
  className: string
  code: Code
  children?: React.ReactNode
  globalConfig: { themeName: string }
}) {
  const { lines } = code
  const allTokens = lines.flatMap(line => line.tokens)

  return (
    <span
      data-ch-theme={globalConfig.themeName}
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
