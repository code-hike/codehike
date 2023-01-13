import { getMDXComponent } from "mdx-bundler/client"
import { getPostNames, getPostSource } from "../../src/posts"

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
      <Content />
    </div>
  )
}
