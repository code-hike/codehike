import * as React from "react"
import {
  Preview as SandpackPreview,
  OpenInCodeSandboxButton,
} from "react-smooshpack"
import { MiniBrowser } from "@code-hike/mini-browser"
import { PreviewProps } from "./context"
import { CodeContext } from "./code-context"

export { Preview, PreviewProps }

function Preview({
  preset,
  files,
  ...props
}: PreviewProps) {
  const codeRunner = React.useMemo(() => {
    return (
      <SandpackPreview
        showNavigator={false}
        showRefreshButton={false}
        showOpenInCodeSandbox={false}
        customStyle={{
          minHeight: "unset",
          height: "100%",
          border: 0,
          margin: 0,
        }}
      />
    )
  }, [preset, files])

  return <MiniBrowser {...props} children={codeRunner} />
}
