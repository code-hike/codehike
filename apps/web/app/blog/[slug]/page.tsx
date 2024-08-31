import { blog } from "@/app/source"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default async function Page({ params }: { params: { slug: string } }) {
  const page = blog.getPage([params.slug])

  if (page == null) {
    notFound()
  }

  const MDX = page.data.exports.default

  return (
    <main
      className={cn(
        "max-w-2xl mx-auto prose dark:prose-invert my-12 px-8 box-content pb-36",
        page.data.className,
      )}
    >
      <div className="mb-4">
        {page.data.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <Author name={page.data.authors[0]} />
      <h1 className="mb-4 text-pretty">{page.data.title}</h1>
      <h2 className="text-accent-foreground/90 text-pretty mb-20 mt-4 text-xl">
        {page.data.description}
      </h2>
      <MDX />
    </main>
  )
}

import pomber from "./pomber.jpg"
import Link from "next/link"

function Author({ name }: { name: string }) {
  if (name === "pomber") {
    return (
      <Link
        className="inline-flex items-center gap-2 no-underline hover:bg-primary/10 rounded not-prose p-2 -m-2 mb-4"
        href="https://twitter.com/pomber"
      >
        <Image
          src={pomber}
          alt="pomber"
          width={34}
          height={34}
          priority={true}
          className="rounded-full"
        />
        <div>
          <div className="font-semibold text-sm">Rodrigo Pombo</div>
          <div className="text-primary/60 text-sm">@pomber</div>
        </div>
      </Link>
    )
  }
  return null
}

export async function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = blog.getPage([params.slug])

  if (page == null) notFound()

  return {
    title: page.data.title + " | Code Hike",
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      type: "article",
      description: page.data.description,
      images: `https://codehike.org/blog/${params.slug}.png`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@codehike_",
      creator: "@pomber",
      title: page.data.title,
      description: page.data.description,
      images: `https://codehike.org/blog/${params.slug}.png`,
    },
  } satisfies Metadata
}
