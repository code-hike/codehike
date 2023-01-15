import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix"
import codeHikeStyles from "@code-hike/mdx/styles.css"

export function meta() {
  return { title: "New Remix App" }
}

export function links() {
  return [{ rel: "stylesheet", href: codeHikeStyles }]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        style={{ maxWidth: 768, margin: "0 auto", fontFamily: "sans-serif" }}
      >
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
