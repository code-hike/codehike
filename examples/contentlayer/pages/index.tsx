import Link from "next/link"
import { allPosts, Post } from "contentlayer/generated"

export async function getStaticProps() {
  return { props: { posts: allPosts } }
}

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h1>A Blog</h1>
      Posts:
      <ul>
        {posts.map((post, idx) => (
          <li key={idx}>
            <Link href={post.url}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
