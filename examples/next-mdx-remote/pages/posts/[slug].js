import fs from "fs"
import { MDXRemote } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Link from "next/link"
import path from "path"
import { postNames, POSTS_PATH } from "../../src/posts"
import { remarkCodeHike } from "@code-hike/mdx"
import { CH } from "@code-hike/mdx/components"
import theme from "shiki/themes/material-palenight.json"

export default function PostPage({ source }) {
  return (
    <div style={{ width: 800, margin: "0 auto", fontFamily: "sans-serif" }}>
      <nav>
        <Link href="/">👈 Go back home</Link>
      </nav>

      <main>
        <MDXRemote {...source} components={{ CH }} />
      </main>
    </div>
  )
}

export const getStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  const source = fs.readFileSync(postFilePath)

  const mdxSource = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [[remarkCodeHike, { autoImport: false, theme }]],
      useDynamicImport: true,
    },
  })

  return {
    props: {
      source: mdxSource,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = postNames.map((slug) => ({ params: { slug } }))
  return {
    paths,
    fallback: false,
  }
}
