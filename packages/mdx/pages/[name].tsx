import { runSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime.js"
import { CH } from "../src/components"
import Link from "next/link"
import { getCode, getFiles } from "../dev/files"

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
  const code = await getCode(name)
  return {
    props: {
      tests: files,
      code,
      current: name,
    },
  }
}

export default function Page({ current, code, tests }) {
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
      <nav
        style={{
          background: "#fafafa",
          borderRadius: 4,
          padding: 16,
          minWidth: 180,
        }}
      >
        <ul style={{ margin: 0, padding: 0 }}>
          {tests.map(test => (
            <li key={test} style={{ listStyle: "none" }}>
              <Link href={`/${encodeURIComponent(test)}`}>
                <a
                  style={{
                    color: "black",
                    textDecoration: "none",
                    fontWeight:
                      test === current ? "bold" : "normal",
                  }}
                >
                  {test}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div
        style={{
          maxWidth: 900,
          minWidth: 600,
          background: "#fafafa",
          borderRadius: 4,
          padding: 16,
        }}
      >
        <Content components={{ CH }} />
      </div>
    </div>
  )
}
