import { runSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime.js"
import { CH } from "../src/components"
import Link from "next/link"
import { getCode, getContent, getFiles } from "../dev/files"

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
  const content = await getContent(name)
  const { code, debugLink } = await getCode(content)
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
  console.log(debugLink)
  const { default: Content } = runSync(code, runtime)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        margin: "8px",
      }}
    >
      <Sidebar tests={tests} current={current} />
      <Result Content={Content} debugLink={debugLink} />
    </div>
  )
}

function Sidebar({ tests, current }) {
  return (
    <nav
      style={{
        background: "#fafafa",
        borderRadius: 4,
        padding: "16px 0",
        minWidth: 180,
      }}
    >
      <ul style={{ margin: 0, padding: 0 }}>
        {tests.map(test => (
          <li
            key={test}
            style={{ listStyle: "none" }}
            className="sidebar-link"
            data-active={test === current}
          >
            <Link href={`/${encodeURIComponent(test)}`}>
              <a>{test}</a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Result({ Content, debugLink }) {
  return (
    <div
      style={{
        maxWidth: 900,
        minWidth: 600,
        background: "#fafafa",
        borderRadius: 4,
        padding: 16,
        position: "relative",
      }}
    >
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
    </div>
  )
}
