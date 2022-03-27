import { allPosts } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"

export async function getStaticPaths() {
  const paths = allPosts.map((_) => "/" + _._raw.flattenedPath)
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((_) => _._raw.flattenedPath === params.slug)
  return {
    props: {
      post,
    },
  }
}

const Page = ({ post }) => {
  const Component = useMDXComponent(post.body.code)
  return (
    <article style={{ maxWidth: 800 }}>
      <h1>{post.title}</h1>
      <Component />
    </article>
  )
}

export default Page
