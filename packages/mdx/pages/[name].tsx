import { compile, runSync } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime.js"
import fs from "fs"
import { remarkCodeHike } from "../src/index"
import { CH } from "../src/components"
import theme from "shiki/themes/slack-dark.json"
import Link from "next/link"

export const config = {
  unstable_includeFiles: ["./tests"],
  includeFiles: ["./tests"],
}

export async function getServerSideProps({ params }) {
  const files = await fs.promises.readdir("./tests/")

  const tests = files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))

  const { name = "test" } = params
  const mdxSource = await fs.promises.readFile(
    `./tests/${name}.mdx`,
    "utf8"
  )
  try {
    const props = {
      tests,
      current: name,
      code: String(
        await compile(mdxSource, {
          outputFormat: "function-body",
          remarkPlugins: [
            [remarkCodeHike, { autoImport: false, theme }],
          ],
        })
      ),
    }
    return { props }
  } catch (e) {
    console.error(
      "getServerSideProps error",
      JSON.stringify(e, null, 2)
    )
  }
  return { props: { error: true, tests, current: name } }
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
