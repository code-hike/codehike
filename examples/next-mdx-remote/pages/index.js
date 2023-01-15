import Link from "next/link"
import { postNames } from "../src/posts"

export default function Index({ posts }) {
  return (
    <div style={{ width: 800, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>My Blog</h1>
      <ul>
        {posts.map((postName) => (
          <li key={postName}>
            <Link as={`/posts/${postName}`} href={`/posts/[slug]`}>
              {postName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function getStaticProps() {
  return { props: { posts: postNames } }
}
