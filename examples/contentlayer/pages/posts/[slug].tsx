import Head from "next/head"
import { allPosts, Post } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"

export async function getStaticPaths() {
  const paths: string[] = allPosts.map((post) => post.url)
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)
  return {
    props: {
      post,
    },
  }
}

const PostLayout = ({ post }: { post: Post }) => {
  const MDXContent = useMDXComponent(post.body.code)
  return (
    <article style={{ width: 600, margin: "0 auto" }}>
      <Head>
        <title>{post.title}</title>
      </Head>
      <h1>{post.title}</h1>
      <MDXContent />
    </article>
  )
}

export default PostLayout
