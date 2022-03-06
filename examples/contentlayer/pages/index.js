import { allPosts } from "contentlayer/generated"
import Link from "next/link"

export const getStaticProps = async ({}) => {
  return {
    props: {
      posts: allPosts.map((post) => ({
        slug: post._raw.flattenedPath,
        title: post.title,
      })),
    },
  }
}

const Home = ({ posts }) => {
  return (
    <ul>
      {posts.map(({ slug, title }) => (
        <li key={slug}>
          <Link href={`/${slug}`}>
            <a>{title}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Home
