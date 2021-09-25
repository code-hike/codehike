import React from "react"
import fs from "fs/promises"
import Link from "next/link"

export async function getStaticProps() {
  const files = await fs.readdir("./content/")
  return {
    props: {
      files: files
        .filter(filename => filename.endsWith(".mdx"))
        .map(filename => filename.slice(0, -4)),
    },
  }
}

export default function Page({ files }) {
  return (
    <ul>
      {files.map(file => (
        <li key={file}>
          <Link href={`/${encodeURIComponent(file)}`}>
            <a>{file}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}
