import { runSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import { CH } from "../src/components"
import { getCode, getFile, getFiles } from "../dev/files"
import { ClickToComponent } from "click-to-react-component"
import { Layout } from "../dev/layout"
import React from "react"

export async function getStaticPaths() {
  const files = await getFiles()
  return {
    paths: files.map(file => ({ params: { name: file } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { name = "test" } = params

  const files = await getFiles()
  const file = await getFile(name)
  const { code, debugLink } = await getCode(file)
  return {
    props: {
      tests: files,
      code,
      debugLink,
      current: name,
    },
  }
}

export default function Page({
  current,
  code,
  tests,
  debugLink,
}) {
  const { default: Content } = runSync(code, runtime)
  return (
    <Layout current={current} contentFileNames={tests}>
      <a
        href={debugLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          right: "16px",
          top: "16px",
        }}
      >
        Debug
      </a>
      <Content components={{ CH }} />
    </Layout>
  )
}
