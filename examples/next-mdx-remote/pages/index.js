import { serialize } from "next-mdx-remote/serialize"
import { MDXRemote } from "next-mdx-remote"
import { remarkCodeHike } from "@code-hike/mdx"
import { CH } from "@code-hike/mdx/dist/components.cjs"
import theme from "shiki/themes/solarized-dark.json"
import fs from "fs"

export async function getStaticProps() {
  // can be from a local file, database, anywhere
  const source = fs.readFileSync("posts/lorem.mdx")
  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [[remarkCodeHike, { autoImport: false, theme }]],
      useDynamicImport: true,
    },
  })
  return { props: { source: mdxSource } }
}

export default function Page({ source }) {
  return (
    <div style={{ width: 800, margin: "0 auto" }}>
      <MDXRemote {...source} components={{ CH }} />
    </div>
  )
}
