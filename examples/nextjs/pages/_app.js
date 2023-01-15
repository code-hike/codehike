import "@code-hike/mdx/styles"

function MyApp({ Component, pageProps }) {
  return (
    <article
      style={{ maxWidth: 768, margin: "0 auto", fontFamily: "sans-serif" }}
    >
      <Component {...pageProps} />
    </article>
  )
}

export default MyApp
