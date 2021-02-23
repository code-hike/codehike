import * as React from "react"
import {
  SandpackPreview,
  useCodeSandboxLink,
} from "react-smooshpack"
import { MiniBrowser } from "@code-hike/mini-browser"
import { PreviewProps } from "./hike-context"

export { Preview, PreviewProps }

function Preview({ filesHash, ...props }: PreviewProps) {
  const preview = React.useMemo(() => {
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
  }, [filesHash])

  return (
    <MiniBrowser
      url=""
      loadUrl={useCodeSandboxLink()}
      {...props}
      children={preview}
    />
  )
}
