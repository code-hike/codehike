import * as React from "react"
import { CodeRunner } from "react-smooshpack"
import {
  MiniBrowser,
  MiniBrowserProps,
} from "@code-hike/mini-browser"
import { Demo } from "./context"

interface PreviewProps extends MiniBrowserProps {}

export { Preview, PreviewProps }

function Preview({
  demo,
  ...props
}: { demo: Demo } & MiniBrowserProps) {
  const codeRunner = React.useMemo(() => {
    const paths = Object.keys(demo.files)
    const files = {} as Record<string, { code: string }>
    paths.forEach(path => {
      files["/" + path] = { code: demo.files[path].code }
    })

    const { preset } = demo

    const customSetup = {
      ...preset?.customSetup,
      files: { ...preset?.customSetup?.files, ...files },
    }

    return (
      <CodeRunner
        template="react"
        {...preset}
        customSetup={customSetup}
        customStyle={{
          minHeight: "unset",
          height: "100%",
          border: 0,
        }}
      />
    )
  }, [demo])

  return <MiniBrowser {...props} children={codeRunner} />
}
