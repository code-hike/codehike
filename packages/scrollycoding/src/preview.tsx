import * as React from "react"
import {
  SandpackPreview,
  useCodeSandboxLink,
} from "@codesandbox/sandpack-react"
import { MiniBrowser } from "@code-hike/mini-browser"
import { PreviewProps } from "./hike-context"
import { LoadingOverlay } from "./preview-loader"

export { Preview, PreviewProps }

function Preview({ filesHash, ...props }: PreviewProps) {
  const link = useCodeSandboxLink()
  const preview = React.useMemo(() => {
    return (
      <>
        <LoadingOverlay />
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
      </>
    )
  }, [link])

  return (
    <MiniBrowser
      url=""
      loadUrl={link}
      {...props}
      children={preview}
    />
  )
}
