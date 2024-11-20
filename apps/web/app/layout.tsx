import "./global.css"
import { RootProvider } from "next-docs-ui/provider"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import { NavBar } from "../ui/nav"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ["latin"],
})

import ch from "codehike/package.json"
import { Metadata } from "next"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.className} snap-y`}
      suppressHydrationWarning
    >
      {/* <script src="https://unpkg.com/intersection-observer-debugger"></script> */}
      <body suppressHydrationWarning>
        <RootProvider>
          <NavBar version={ch.version} />
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  )
}
export const metadata: Metadata = {
  title: "Code Hike",
  description:
    "Use Markdown and React to build rich content websites. Documentation, tutorials, blogs, videos, interactive walkthroughs, and more.",
  // metadataBase: new URL("https://codehike.org"),
  openGraph: {
    title: "Code Hike",
    images: `https://codehike.org/codehike.png`,
    siteName: "Code Hike",
  },
  twitter: {
    card: "summary_large_image",
    site: "@codehike_",
    creator: "@pomber",
    images: `https://codehike.org/codehike.png`,
  },
  alternates: {
    types: {
      "application/rss+xml": "https://codehike.org/blog/feed.xml",
    },
  },
}
