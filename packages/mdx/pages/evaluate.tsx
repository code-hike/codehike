import { compile } from "@mdx-js/mdx"
import { runSync, evaluateSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime.js"
import { remarkCodeHike } from "../src/index"
import { CH } from "../src/components"
import fs from "node:fs"

export async function getServerSideProps() {
  const source = fs.readFileSync(
    "./tests/scrollycoding.mdx",
    "utf8"
  )
  const code = String(
    await compile(source, {
      outputFormat: "function-body",
      remarkPlugins: [
        [remarkCodeHike, { autoImport: false }],
      ],
    })
  )
  return {
    props: {
      title: "Home",
      source,
      code,
    },
  }
}

export default function Page({ title, code, source }) {
  // const { default: Content } = evaluateSync(source, {
  //   ...runtime,
  //   remarkPlugins: [
  //     [remarkCodeHike, { autoImport: false }],
  //   ],
  // } as any)

  const { default: Content } = runSync(code, runtime)
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>{title}</h1>
      <Content components={{ CH: CH as any }} />
    </div>
  )
}
