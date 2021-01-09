import * as React from "react"
import { CodeRunner } from "react-smooshpack"
import {
  MiniBrowser,
  MiniBrowserProps,
} from "@code-hike/mini-browser"
import { StepCode } from "./context"

export { Preview }

function Preview({
  stepCode,
  ...props
}: { stepCode: StepCode } & MiniBrowserProps) {
  const paths = Object.keys(stepCode.files)
  const files = {} as Record<string, { code: string }>
  paths.forEach(path => {
    files["/" + path] = { code: stepCode.files[path].code }
  })

  return (
    <MiniBrowser {...props}>
      <CodeRunner customSetup={{ files }} />
    </MiniBrowser>
  )
}
