import RSS from "rss"
import { blog } from "../../source"

const posts = blog.getPages().filter((page) => page.data.draft !== true)

export const dynamic = "force-static"

export async function GET() {
  const feed = new RSS({
    title: "Code Hike",
    description: "Markdown, React and everything in between.",
    generator: "RSS for Node and Next.js",
    feed_url: "https://v1.codehike.org/blog/feed.xml",
    site_url: "https://v1.codehike.org/blog",
    language: "en-US",
    pubDate: new Date().toUTCString(),
    ttl: 120,
    image_url: "https://v1.codehike.org/logo.png",
  })

  posts.map(({ data, url }) => {
    feed.item({
      title: data.title,
      description: data.description || "",
      url: `https://v1.codehike.org${url}`,
      author: data.authors[0],
      date: data.date,
    })
  })

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  })
}
