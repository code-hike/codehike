import { getMDXComponent } from "mdx-bundler/client"
import { getPostNames, getPostSource } from "../../src/posts"
import Link from "next/link"

export function getStaticPaths() {
  const paths = getPostNames().map((postName) => ({ params: { postName } }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  return { props: { source: await getPostSource(params.postName) } }
}

export default function Page({ source }) {
  const Content = getMDXComponent(source)
  return (
    <div style={{ width: 800, margin: "0 auto", fontFamily: "sans-serif" }}>
      <nav>
        <Link href="/">👈 Go back home</Link>
      </nav>
      <main>
        <Content />
      </main>
    </div>
  )
}
