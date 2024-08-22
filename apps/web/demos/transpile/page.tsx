import { RawCode } from "codehike/code"

import Content from "./content.md"
import ts from "typescript"
import { CodeTabs } from "../tabs/page"

export default function Page() {
  return <Content components={{ Code }} />
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  // Since this is a RSC we can transpile stuff here
  // (there are probably more efficient ways to do this)
  const result = ts.transpileModule(codeblock.value, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ESNext,
    },
  })

  const tsCode = { ...codeblock, meta: "typescript" }
  const jsCode = {
    ...codeblock,
    value: result.outputText,
    lang: "js",
    meta: "javascript",
  }

  return <CodeTabs tabs={[tsCode, jsCode]} />
}
