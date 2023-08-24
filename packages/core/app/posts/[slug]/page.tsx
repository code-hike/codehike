import { allPosts } from "contentlayer/generated"

// import { Hike } from "../../hike"
// import { Scrollycoding } from "../../scrollycoding"
// import { Slideshow } from "../../slideshow"
// import { Code } from "../../code"
import { PostClient } from "./post.client"

export const generateStaticParams = async () =>
  allPosts.map(post => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = ({
  params,
}: {
  params: { slug: string }
}) => {
  const post = allPosts.find(
    post => post._raw.flattenedPath === params.slug
  )
  if (!post)
    throw new Error(
      `Post not found for slug: ${params.slug}`
    )
  return { title: post.title }
}

const PostLayout = ({
  params,
}: {
  params: { slug: string }
}) => {
  const post = allPosts.find(
    post => post._raw.flattenedPath === params.slug
  )
  if (!post)
    throw new Error(
      `Post not found for slug: ${params.slug}`
    )

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div className="[&>*]:mb-3 [&>*:last-child]:mb-0">
        <PostClient code={post.body.code} />
      </div>
    </article>
  )
}

export default PostLayout
