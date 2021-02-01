import * as React from "react"
import { SandpackRunner } from "react-smooshpack"
import { MiniBrowser } from "@code-hike/mini-browser"
import { PreviewProps } from "./context"

export { Preview, PreviewProps }

function Preview({
  template,
  files,
  ...props
}: PreviewProps) {
  const codeRunner = React.useMemo(() => {
    const runnerProps = {
      ...defaultRunnerProps,
      ...template,
      setup: {
        ...template?.setup,
        files: { ...template?.setup?.files, ...files },
      },
    }

    return <SandpackRunner {...runnerProps} />
  }, [template, files])

  return <MiniBrowser {...props} children={codeRunner} />
}

const defaultRunnerProps = {
  template: "react" as const,
  customStyle: {
    minHeight: "unset",
    height: "100%",
    border: 0,
  },
}
