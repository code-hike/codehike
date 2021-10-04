import React from "react"
import fs from "fs/promises"
import Link from "next/link"

export async function getStaticProps() {
  const files = await fs.readdir("./content/")
  const filenames = files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => filename.slice(0, -4))
  filenames.sort((a, b) => a.length - b.length)
  return {
    props: {
      files: filenames,
    },
  }
}

export default function Page({ files }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fafafa",
      }}
    >
      <h1>Code Hike Demos</h1>
      <div style={{ fontSize: "1.2em" }}>
        {files.map(file => (
          <div key={file}>
            <Link
              href={`/${encodeURIComponent(
                file
              )}/material-palenight`}
            >
              <a>{file}</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
