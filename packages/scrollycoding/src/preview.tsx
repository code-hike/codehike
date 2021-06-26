import * as React from "react"
import {
  SandpackPreview,
  useCodeSandboxLink,
} from "@codesandbox/sandpack-react"
import {
  MiniBrowser,
  MiniBrowserProps,
} from "@code-hike/mini-browser"
import { useLoadingOverlayState } from "@codesandbox/sandpack-react"
import { useClasser } from "@code-hike/classer"

interface PreviewProps extends MiniBrowserProps {}

export { Preview, PreviewProps }

function Preview(props: PreviewProps) {
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
      transition="slide"
      {...props}
      children={preview}
    />
  )
}

function LoadingOverlay() {
  const c = useClasser("ch-hike")
  const loadingOverlayState = useLoadingOverlayState()
  return loadingOverlayState === "visible" ? (
    <div className={c("loading")}>
      <div className={c("loading-cubes")}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : null
}
